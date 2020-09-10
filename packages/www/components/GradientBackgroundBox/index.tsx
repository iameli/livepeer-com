import { Box } from "@theme-ui/components";
import Slider from "../Slider";
import { SxStyleProp } from "theme-ui";

export type Gradient = "violet" | "colorful" | null;

type Props = {
  children?: React.ReactNode;
  gradient?: Gradient;
  slide?: boolean;
  sx?: SxStyleProp;
  gradientSx?: SxStyleProp;
  id: string;
};

const GradientBackgroundBox = ({
  children = null,
  sx,
  slide = false,
  gradient = "violet",
  id,
  gradientSx,
  ...moreProps
}: Props) => {
  const gradientMarkup = (
    <div sx={{ width: 2766, minWidth: "100vw", ...gradientSx }}>
      <img src={`/img/gradient-${gradient}.svg`} sx={{ width: "100%" }} />
    </div>
  );

  return (
    <Box
      sx={{ position: "relative", overflow: "hidden", ...sx }}
      {...moreProps}
    >
      {gradient && (
        <>
          {slide ? (
            <div
              sx={{
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
                pointerEvents: "none",
                top: 0
              }}
            >
              <Slider duration={3}>{gradientMarkup}</Slider>
            </div>
          ) : (
            <div
              sx={{
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
                pointerEvents: "none",
                top: 0
              }}
            >
              <div
                sx={{
                  position: "relative",
                  width: "100vw"
                }}
              >
                {gradientMarkup}
              </div>
            </div>
          )}
        </>
      )}
      {children}
    </Box>
  );
};

export default GradientBackgroundBox;
