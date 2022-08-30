import React from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import "bootstrap/dist/css/bootstrap.min.css";

const RightSidebar = ({ showSidebar, setShowSidebar, title, children }) => {
  return (
    <Offcanvas
      show={showSidebar}
      onHide={() => setShowSidebar(false)}
      placement="end"
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>{title}</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>{children}</Offcanvas.Body>
    </Offcanvas>
  );
};

export default RightSidebar;
