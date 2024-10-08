import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  balance: 0,
  loan: 0,
  loanPurpose: "",
  isLoading: false,
};

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    deposit: (state, action) => {
      state.balance += action.payload;
    },
    withdraw: (state, action) => {
      state.balance -= action.payload;
    },
    requestLoan: {
      prepare(amount, purpose) {
        return {
          payload: {
            loan: amount,
            loanPurpose: purpose,
          },
        }
      },
      reducer(state, action) {
        if (state.loan > 0) return;
        state.balance += action.payload.loan;
        state.loan = action.payload.loan;
        state.loanPurpose = action.payload.loanPurpose;
      }
    },
    payLoan: (state) => {
      state.balance -= state.loan;
      state.loan = 0;
      state.loanPurpose = "";
    },
    convertingCurrency: (state) => {
      state.isLoading = true
    }
  },
});

export default accountSlice.reducer;
export const { withdraw, requestLoan, payLoan } = accountSlice.actions

export function deposit(amount, currency) {
  if (currency === "USD") {
    return { type: "account/deposit", payload: amount };
  }
  return async (dispatch, getState) => {
    dispatch({ type: "account/convertingCurrency" })
    const res = await fetch(`https://api.frankfurter.app/latest?amount=${amount}&from=${currency}&to=USD`)
    const data = await res.json();
    dispatch({ type: "account/deposit", payload: data.rates.USD });
  }
}

// export default function accountReducer(state = initialState, action) {
//   switch (action.type) {
//     case "account/deposit":
//       return {
//         ...state,
//         balance: state.balance + action.payload,
//         isLoading: false,
//       };
//     case "account/withdraw":
//       return {
//         ...state,
//         balance: state.balance - action.payload,
//       };
//     case "account/requestLoan":
//       if (state.loan > 0) return state;
//       return {
//         ...state,
//         balance: state.balance + action.payload.loan,
//         loan: action.payload.loan,
//         loanPurpose: action.payload.loanPurpose,
//       };
//     case "account/payLoan":
//       return {
//         ...state,
//         balance: state.balance - state.loan,
//         loan: 0,
//         loanPurpose: "",
//       };
//     case "account/convertingCurrency":
//       return {
//         ...state,
//         isLoading: true
//       }
//     default:
//       return state;
//   }
// }

// export function deposit(amount, currency) {
//   if (currency === "USD") {
//     return { type: "account/deposit", payload: amount };
//   }
//   return async (dispatch, getState) => {
//     dispatch({ type: "account/convertingCurrency" })
//     const res = await fetch(`https://api.frankfurter.app/latest?amount=${amount}&from=${currency}&to=USD`)
//     const data = await res.json();
//     dispatch({ type: "account/deposit", payload: data.rates.USD });
//   }
// }

// export function withdraw(amount) {
//   return { type: "account/withdraw", payload: amount };
// }

// export function requestLoan(amount, purpose) {
//   return {
//     type: "account/requestLoan",
//     payload: {
//       loan: amount,
//       loanPurpose: purpose,
//     },
//   }
// }

// export function payLoan() {
//   return { type: "account/payLoan" };
// }