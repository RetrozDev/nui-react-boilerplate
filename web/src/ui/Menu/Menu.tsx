// This menu is a simple test for the ui

import type React from "react";
import type { MenuData } from "../../types/data";

type MenuProps = {
	data: MenuData;
};

const Menu: React.FC<MenuProps> = ({ data }) => {
	return (
		<div className="menu">
			<h1>{data.title}</h1>
		</div>
	);
};

export default Menu;
