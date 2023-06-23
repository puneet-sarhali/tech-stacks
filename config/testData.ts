export const data = {
  name: "frontend",
  iconPath: "/frontend.png",
  children: [
    {
      name: "react",
      iconPath: "/react.svg",
      repo: "facebook/react",
      children: [
        {
          name: "UI",
          iconPath: "/ui.png",
          children: [
            {
              name: "tailwind",
              iconPath: "/tailwind.svg",
              repo: "tailwindlabs/tailwindcss",
            },
            {
              name: "bootstrap",
              iconPath: "/bootstrap.svg",
              repo: "react-bootstrap/react-bootstrap",
            },
            {
              name: "material UI",
              iconPath: "/mui.svg",
              repo: "mui-org/material-ui",
            },
          ],
        },
        {
          name: "state",
          iconPath: "/state.png",
          children: [
            { name: "redux", iconPath: "/redux.svg", repo: "reduxjs/redux" },
            { name: "mobx", iconPath: "/mobx.svg", repo: "mobxjs/mobx" },
          ],
        },
      ],
    },
    {
      name: "vue",
      iconPath: "/vue.svg",
      repo: "vuejs/vue",
      children: [
        {
          name: "UI",
          iconPath: "/ui.png",
          children: [
            { name: "tailwind", iconPath: "/tailwind.svg" },
            { name: "bootstrap", iconPath: "/bootstrap.svg" },
            { name: "material UI", iconPath: "/mui.svg" },
          ],
        },
        {
          name: "state",
          iconPath: "/state.png",
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
