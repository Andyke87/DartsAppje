/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react'
import { NavLink } from 'react-router-dom'

const StyledNavLink = (props) => {
  return (
    <NavLink
      {...props}
      className={({ isActive }) =>
        `${props.className} ${isActive ? " hidden " : "p-2  rounded-md text-2xl font-bold"}`
      }
    />
  );
}
export default StyledNavLink