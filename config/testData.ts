export const data = {
  name: "frontend",
  iconPath: "/react.svg",
  children: [
    {
      name: "react",
      iconPath: "/react.svg",
      repo: "facebook/react",
      children: [
        {
          name: "ui",
          iconPath: "/react.svg",
          children: [
            {
              name: "tailwind",
              iconPath: "/tailwind.svg",
              repo: "tailwindlabs/tailwindcss",
            },
            { name: "bootstrap", iconPath: "/bootstrap.svg" },
            { name: "material ui", iconPath: "/mui.svg" },
          ],
        },
        {
          name: "state",
          iconPath: "/react.svg",
          children: [
            { name: "redux", iconPath: "/redux.svg" },
            { name: "mobx", iconPath: "/mobx.svg" },
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
            { name: "tailwind", iconPath: "/tailwind.svg" },
            { name: "bootstrap", iconPath: "/bootstrap.svg" },
            { name: "material ui", iconPath: "/mui.svg" },
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
