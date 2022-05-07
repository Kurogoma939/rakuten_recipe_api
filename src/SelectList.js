import React from "react";

const SelectList = ({ categoryId, categoryName }) => {
	return (
		<option value={categoryId}>{categoryName}</option>
	);
}

export default SelectList;