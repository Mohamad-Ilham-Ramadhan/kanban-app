import { forwardRef } from "react";
import { Select as BaseSelect, SelectProps, SelectRootSlotProps } from '@mui/base/Select'

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
            popper: { disablePortal: true, className: "w-full z-[9000]"},
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
     <button className="bg-cyan-500 text-gray-800" data-fuck="yeah" type="button" {...other} ref={ref}>
       {other.children}
     </button>
   );
 });

export default Select;