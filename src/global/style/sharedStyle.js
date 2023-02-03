import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
html {
  box-sizing: border-box;
  font-family: 'Poppins', 'Noto Sans TC', sans-serif;
  // global color
  --color-background-yellow: #fced35;
  --color-SVG-background-gray: #f0f4f7;
  --color-button-red: #d52400;
}
button {
  font-family: 'Poppins', 'Noto Sans TC', sans-serif;
  cursor: pointer;
}
input {
  font-family: 'Poppins', 'Noto Sans TC', sans-serif;
  -webkit-appearance: none;
}
`;

export default GlobalStyle;
