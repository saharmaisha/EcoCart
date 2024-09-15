import styled, { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
    html, body, #__next {
        background: url('/imgs/Background.png') no-repeat center fixed;
        background-size: cover;
        background-color: rgba(255, 255, 255, 0.02);
        z-index: -1;
    } 
`;

// export const GlobalStyle = createGlobalStyle`
//     html, body, #__next {
//         margin: 0;
//         padding: 0;
//         min-height: 100%;
//         background-color: #D3D3D3;  
//         font-family: sans-serif;
//     }
//     body {
//         overflow-y: scroll;
//     }
// `;

export const Container = styled.div`
    display: flex; 
    gap: 10px;
    flex-wrap: wrap;
    max-width: 900px; 
    margin: 0 auto;
    padding: 40px 20px; 
    border-radius: 8px;
`;

export const Image = styled.img`
    margin-left: auto;
    margin-right: auto;
    width: 50%;
    margin-top: 0;
`

export const LoginButton = styled.button`
  width: 75%;
  padding: 12px; 
  border-radius: 4px;
  border: none;
  background-color: #1C3A13;
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #37622A;
  }
`;

export const Square = styled.div`
    width: 50vw;
    height: 100vh;
    background-color: #1C3A13; 
    position: fixed;
    top: 0;
    left: 0;
    padding: 20px;
    box-sizing: border-box; 
`

// export const Subtitle = styled.h2`
//   color: #F5E0B7;  
//   margin-top: 30px;
//   size: 5rem;
// `;

// export const AlertBox = styled.div`
//   background-color: #92400e;
//   border: 1px solid #b45309;
//   color: #ffffff;
//   padding: 10px;
//   margin: 20px 0;
//   border-radius: 5px;
// `;

// export const Form = styled.form`
//   display: flex;
//   flex-direction: column;
//   gap: 15px;
// `;

// export const FormGroup = styled.div`
//   display: flex;
//   flex-direction: column;
// `;

// export const FormContainer = styled.div`
//   background-color: #F5E0B7; // light yellow
//   padding: 20px;
//   border-radius: 8px;
//   margin-top: 20px;
// `;

// export const Label = styled.label`
//   display: block;
//   margin-bottom: 4px;
//   color: #1C3A13; // medium green
//   font-size: 14px;
// `;

// // export const Input = styled.input`
// // padding: 12px;
// // margin: 6px 0;
// // border-radius: 4px;
// // border: 1px solid #3a3a3a;
// // background-color: #2c2c2c;
// //   color: #ffffff;
// //   font-size: 14px;

// //   &:focus {
// //     outline: none;
// //     border-color: #4c1d95;
// //   }
// // `;

// // export const Select = styled.select`
// //   width: 100%;
// //   padding: 12px;
// //   margin: 6px 0;
// //   border-radius: 4px;
// //   border: 1px solid #3a3a3a;
// //   background-color: #2c2c2c;
// //   color: #ffffff;
// //   font-size: 14px;
// //   appearance: none;
// //   background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23ffffff' d='M10.293 3.293L6 7.586 1.707 3.293A1 1 0 00.293 4.707l5 5a1 1 0 001.414 0l5-5a1 1 0 10-1.414-1.414z'/%3E%3C/svg%3E");
// //   background-repeat: no-repeat;
// //   background-position: right 12px center;

// //   &:focus {
// //     outline: none;
// //     border-color: #4c1d95;
// //   }
// // `;

// export const LoginButton = styled.button`
//   width: 50%;
//   padding: 12px;
//   margin: 6px 0;
//   border-radius: 4px;
//   border: none;
//   background-color: #1C3A13;
//   color: #ffffff;
//   font-size: 16px;
//   font-weight: bold;
//   cursor: pointer;
//   transition: background-color 0.3s;

//   &:hover {
//     background-color: #5b21b6;
//   }
// `;


// export const OrderList = styled.ul`
//   list-style-type: none;
//   padding: 0;
//   margin: 0;
// `;

// export const OrderItem = styled.li`
//   background-color: #2c2c2c;
//   margin-bottom: 15px;
//   padding: 20px;
//   border-radius: 5px;
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   flex-wrap: wrap;
// `;

// export const OrderDetails = styled.div`
//   flex: 1;
//   min-width: 200px;
//   margin-right: 20px;
// `;

// export const ButtonGroup = styled.div`
//   display: flex;
//   gap: 10px;
//   flex-wrap: wrap;
// `;

// export const DownloadLink = styled.a`
//   background-color: #4c1d95;
//   color: #ffffff;
//   text-decoration: none;
//   padding: 10px 15px;
//   border-radius: 5px;
//   font-weight: bold;
//   transition: background-color 0.3s;

//   &:hover {
//     background-color: #5b21b6;
//   }
// `;

// export const Table = styled.table`
//   width: 100%;
//   border-collapse: separate;
//   border-spacing: 0 10px;
// `;

// export const TableRow = styled.tr`
//   background-color: #2c2c2c;
// `;

// export const TableCell = styled.td`
//   padding: 15px;
//   border-top: 1px solid #4b5563;
//   border-bottom: 1px solid #4b5563;

//   &:first-child {
//     border-left: 1px solid #4b5563;
//     border-top-left-radius: 5px;
//     border-bottom-left-radius: 5px;
//   }

//   &:last-child {
//     border-right: 1px solid #4b5563;
//     border-top-right-radius: 5px;
//     border-bottom-right-radius: 5px;
//   }
// `;

// export const IconButton = styled.button`
//   background: none;
//   border: none;
//   color: #ffffff;
//   cursor: pointer;
//   font-size: 1.2rem;
// `;