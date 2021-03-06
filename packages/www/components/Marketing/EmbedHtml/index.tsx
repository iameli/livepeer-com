const Index = ({ node }) => {
  const { html } = node;
  if (!html) {
    return undefined;
  }
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

export default Index;
