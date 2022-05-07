import React from "react";
import style from "./recipe.module.css"



const Recipe = ({ recipeTitle, publish, recipeUrl, foodImageUrl, recipeMaterial }) => {
  return (
    <li className={style.recipe}>
      <a href={recipeUrl} target="_blank" rel="noreferrer">
        <img src={foodImageUrl} alt={recipeTitle} />
      </a>
      <h2>{recipeTitle}</h2>
      <p>{publish}</p>
      <h3>レシピ材料</h3>
      <ol>
        {
          recipeMaterial.map((item, index) => {
            return (
              <li key={index}>{item}</li>
            )
          })
        }
      </ol>
    </li>
  );
}

export default Recipe;