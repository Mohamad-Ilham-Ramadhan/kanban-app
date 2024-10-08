import { RootState } from "../_redux/store";
import { Provider } from "react-redux"
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from "../_redux/store"
import { useDispatch, useSelector } from "react-redux";
import { Task } from "../_redux/reducers/boardReducer";
import CobaComponent from './cobaComponent';

export default function Coba() {
   const state = useSelector<RootState>((state) => state.coba);
   console.log('state', state);
   const dispatch = useDispatch();
 
   return (
      <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
         <CobaComponent />
      </PersistGate>
    </Provider>
   );
}