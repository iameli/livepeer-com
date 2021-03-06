import React, { useCallback } from "react";
import { Box, Heading, Text, Flex } from "@livepeer.com/design-system";
import { useApi, useAnalyzer } from "hooks";
import { useEffect, useState } from "react";
import { StreamInfo } from "hooks/use-api";
import Chart from "components/Dashboard/Chart";
import StreamDetail from "layouts/streamDetail";
import { useRouter } from "next/router";
import { Stream } from "@livepeer.com/api";
import { useQuery, useQueryClient } from "react-query";
import HealthChecksTable from "components/Dashboard/HealthChecksTable";
import Logger from "@components/Dashboard/Logger";

const interval = 10000;
const maxItems = 6;

const Health = () => {
  const [dataChart, setDataChart] = useState<{ name: number; kbps: number }[]>([
    { name: 0, kbps: 0 },
  ]);
  const [info, setInfo] = useState<StreamInfo | null>(null);
  const { getStream, getStreamInfo } = useApi();
  const { getHealth } = useAnalyzer();

  const router = useRouter();
  const queryClient = useQueryClient();
  const { query } = router;
  const id = query.id as string;

  const fetcher = useCallback(async () => {
    const stream: Stream = await getStream(id);
    return stream;
  }, [id]);

  const { data: stream } = useQuery([id], () => fetcher());

  const invalidateStream = useCallback(() => {
    return queryClient.invalidateQueries(id);
  }, [queryClient, id]);

  const refetchInterval = 5 * 1000;
  const { data: streamHealth } = useQuery({
    queryKey: ["health", stream?.region, stream?.id, stream?.isActive],
    queryFn: async () =>
      !stream?.region ? null : await getHealth(stream.region, stream.id),
    refetchInterval,
  });

  const doGetInfo = useCallback(
    async (id: string) => {
      setInfo(null);
      const [, rinfo] = await getStreamInfo(id);
      if (!rinfo || rinfo.isSession === undefined) {
        return;
      } else if (rinfo.stream) {
        const info = rinfo as StreamInfo;
        setInfo(info);
      }
    },
    [getStreamInfo]
  );

  const getIngestRate = useCallback(
    async (id: string) => {
      const [, rinfo] = await getStreamInfo(id);
      if (!rinfo?.session) {
        return;
      }
      const newInfo = rinfo as StreamInfo;
      setDataChart((prev) => {
        const lastItem = prev[prev.length - 1];
        return [
          ...prev,
          {
            name: lastItem ? lastItem.name + interval / 1000 : 0,
            kbps: Math.round((newInfo.session.ingestRate / 1000) * 8), // kilobits rather than bytes here
          },
        ].slice(Math.max(prev.length - maxItems, 0));
      });
    },
    [getStreamInfo]
  );

  useEffect(() => {
    if (!id) {
      return;
    }
    doGetInfo(typeof id === "string" ? id : null);
  }, [doGetInfo]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      if (info) {
        getIngestRate(typeof id === "string" ? id : null);
      } else return null;
    }, interval);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [getIngestRate, info]);

  return (
    <StreamDetail
      activeTab="Health"
      stream={stream}
      streamHealth={streamHealth}
      invalidateStream={invalidateStream}
      breadcrumbs={[
        { title: "Streams", href: "/dashboard/streams" },
        { title: stream?.name, href: `/dashboard/streams/${id}` },
        { title: "Health" },
      ]}>
      <HealthChecksTable
        stream={stream}
        streamHealth={streamHealth}
        invalidateStream={invalidateStream}
        css={{ mb: "$7" }}
        emptyState={
          <Text variant="gray" size="2">
            No targets
          </Text>
        }
        tableLayout="auto"
        border
      />
      <Logger stream={stream} css={{ mb: "$7" }} />
      <Box
        css={{
          borderBottom: "1px solid",
          borderColor: "$mauve6",
          pb: "$2",
          mb: "$7",
          width: "100%",
        }}>
        <Heading size="1" css={{ fontWeight: 500, mb: "$1" }}>
          Session ingest rate
        </Heading>
        <Text variant="gray" size="3">
          After the stream loads, ingest rate updates every 10 seconds.
        </Text>
      </Box>

      <Chart data={dataChart} />
    </StreamDetail>
  );
};
export default Health;
