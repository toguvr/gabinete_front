import styled from "styled-components";

export const Container = styled.div`
  position: relative;
  > svg {
    position: ${(props) => (props.fullScreen ? "fixed" : "absolute")};
    top: ${(props) => (props.fullScreen ? "32px" : "15px")};
    right: 22px;
    z-index: 1;
  }

  > img {
    position: fixed;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: 2px solid #ff9000;
    padding: 3px;
    bottom: 40px;
    right: 20px;
    z-index: 9;
  }
  .Draftail-Editor {
    width: 100%;
    background-color: #28262e !important;
    border: 0px solid transparent;
    color: #fff;
    padding: 10px;
    margin-top: 20px;
    align-self: center;
  }
  .Draftail-Toolbar {
    border-bottom: 10px solid #3e3b47;
    background-color: #28262e;
    padding: 0;
    color: #fff;
    border-radius: 4px 4px 0px 0px;
    min-height: 47px;
  }
  .DraftEditor-root {
    font-size: ${(props) => props.fullScreen && "50px"};

    color: #fff !important;
    min-height: ${(props) => (props.fullScreen ? "100vh" : "400px")};
  }
  .Draftail-Editor--readonly .DraftEditor-editorContainer {
    opacity: 1 !important;
  }
`;
