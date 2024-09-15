import styled, { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
    html, body, #__next {
        background: url('/imgs/Background.png') no-repeat center fixed;
        background-size: cover;
        background-color: rgba(255, 255, 255, 0.02);
        z-index: -1;
    } 
`;
