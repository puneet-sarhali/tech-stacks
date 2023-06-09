export const data = {
  name: "frontend",
  iconPath: "/react.svg",
  children: [
    {
      name: "react",
      iconPath: "/react.svg",
      children: [
        {
          name: "ui",
          iconPath: "/react.svg",
          children: [
            { name: "vanilla tailwind", iconPath: "/react.svg" },
            { name: "bootstrap", iconPath: "/react.svg" },
            { name: "material ui", iconPath: "/react.svg" },
          ],
        },
        {
          name: "state",
          iconPath: "/react.svg",
          children: [
            { name: "redux", iconPath: "/react.svg" },
            { name: "mobx", iconPath: "/react.svg" },
          ],
        },
      ],
    },
    {
      name: "vue",
      iconPath: "/vue.svg",
      children: [
        {
          name: "ui",
          iconPath: "/react.svg",
          children: [
            { name: "vanilla tailwind", iconPath: "/react.svg" },
            { name: "bootstrap", iconPath: "/react.svg" },
            { name: "material ui", iconPath: "/react.svg" },
          ],
        },
        {
          name: "state",
          iconPath: "/react.svg",
          children: [
            { name: "vuex", iconPath: "/react.svg" },
            { name: "pinia", iconPath: "/react.svg" },
            { name: "vuestorefront", iconPath: "/react.svg" },
          ],
        },
      ],
    },
  ],
};
