import React,{forwardRef} from 'react';
import {Link as RouterLink,NavLink as RouterNavLink} from 'react-router-dom';
import {Ui} from './Preferences';
export const Link=forwardRef((props,ref)=><Ui {...props} as={RouterLink} ref={ref}/>);
export const NavLink=forwardRef((props,ref)=><Ui {...props} as={RouterNavLink} ref={ref}/>);
