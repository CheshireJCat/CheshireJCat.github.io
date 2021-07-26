export default [
  {
    id: "vdomList",
    name: "虚拟长列表",
  },
].map((item) => {
  return { ...item, path: `/demos/${item.id}` };
});
