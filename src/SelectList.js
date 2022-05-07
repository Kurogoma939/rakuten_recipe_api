import React from "react";

const SelectList = ({ parentCategoryId, categoryId, categoryName }) => {
	return (
		<option name={parentCategoryId} value={categoryId}>{categoryName}</option>
	);
}

export default SelectList;