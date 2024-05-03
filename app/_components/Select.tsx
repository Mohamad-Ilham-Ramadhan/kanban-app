import { forwardRef } from "react";
import { Select as BaseSelect, SelectProps, SelectRootSlotProps, SelectListboxSlotProps, selectClasses } from '@mui/base/Select';
import {Option as BaseOption, optionClasses } from '@mui/base/Option';
// import UnfoldMoreRoundedIcon from '@mui/icons-material/UnfoldMoreRounded';
import { CssTransition } from '@mui/base/Transitions';
import { PopupContext } from '@mui/base/Unstable_Popup';

const Select = forwardRef(function CustomSelect<Tvalue extends {}, Multiple extends boolean>(
   props: SelectProps<Tvalue, Multiple>,
   ref: React.ForwardedRef<HTMLButtonElement>,
) {
   return (
      <BaseSelect
         {...props}
         ref={ref}
         slotProps={{
            listbox: {className:'w-full bg-red-500' },
            root: {className: 'w-full bg-cyan-500 text-gray-800'},
            popper: { disablePortal: true, className: "w-full h-[100px] bg-red-100 z-[9000]"},
         }}
      />
   );
});

const Button = forwardRef(function Button<
   TValue extends {},
   Multiple extends boolean,
 >(
   props: SelectRootSlotProps<TValue, Multiple>,
   ref: React.ForwardedRef<HTMLButtonElement>,
 ) {
   const { ownerState, ...other } = props;
   return (
     <button className="bg-cyan-500 text-gray-800" data-fuck="yeah" type="button" {...other} ref={ref} onClick={() => {
      alert('uhuy')
     }}>
       {other.children}
     </button>
   );
 });

const Option = ({props} : any) => {
   return (
      <BaseOption {...props} />
   );
}

export default Select;