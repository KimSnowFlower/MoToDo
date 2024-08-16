import {createGlobalStyle} from 'styled-components';
import reset from 'styled-reset';

export const GlobalStyle = createGlobalStyle`
    ${reset}
    /* Global styles */
    html, body {
        margin: 0;
        padding: 0;
        height: 100%;
        width: 100%;
        overflow: hidden;
        background: ${({ theme }) => theme.bgColor};
        color: ${({ theme }) => theme.textColor};
        line-height: 1.5;
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
    }

    /* App.css styles */
    .app-container {
        display: flex;
        flex-direction: column;
        height: 100vh;
        width: 100vw;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        position: relative;
    }

    .full-screen-wrapper {
        position: relative;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        background: #f5f5f5;
        z-index: 1;
    }

    .centered-content {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .ratio-box {
        position: relative;
        width: 100%;
        padding-top: 56.25%;
        background: #f5f5f5;
        overflow: hidden;
    }

    .ratio-box > .content {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    /* CurrentDateTime.css styles */
    #parent {
        width: 100%;
        text-align: center;
        padding: 10px 0;
        box-sizing: border-box;
    }

    #timeDisplay {
        display: inline-block;
        color: rgb(255, 255, 255);
        font-size: 16px;
    }
`;