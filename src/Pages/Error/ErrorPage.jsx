/* eslint-disable no-unused-vars */
import React from "react";
import { useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <p className="text-6xl font-bold">{error.status}</p>
      <p>{error.statusText}</p>
    </div>
  );
};

export default ErrorPage;
