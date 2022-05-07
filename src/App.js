import React, { useEffect, useState } from "react";
import './App.css';
import './Select.css';
import Recipe from "./Recipe";
import SelectList from "./SelectList";
import { APP_ID } from "./secret";

const App = () => {

  const [recipes, setRecipes] = useState([]);
  const [largeList, setLargeSelect] = useState(['選択してください']);
  const [mediumList, setMediumSelect] = useState(['選択してください']);

  useEffect(() => {
    getRecipes();
    getMediumCategory();
    getLargeCategory();
  }, []);

  // 人気上位のレシピ取得 
  const getRecipes = async () => {
    const response = await fetch(`https://app.rakuten.co.jp/services/api/Recipe/CategoryRanking/20170426?applicationId=${APP_ID}&categoryId=10-66-50`)
    const data = await response.json();
    setRecipes(data.result);
  }
  // 大分類カテゴリ取得
  const getLargeCategory = async () => {
    const response = await fetch(`https://app.rakuten.co.jp/services/api/Recipe/CategoryList/20170426?format=json&categoryType=large&applicationId=${APP_ID}`)
    const data = await response.json();
    console.log('large');
    console.log(data.result.large);
    setLargeSelect(data.result.large);
  }
  // 小分類カテゴリ取得
  const getMediumCategory = async (largeId) => {
    const response = await fetch(`https://app.rakuten.co.jp/services/api/Recipe/CategoryList/20170426?format=json&categoryType=medium&applicationId=${APP_ID}`)
    const data = await response.json();
    console.log('medium');
    console.log(data.result.medium);
    // 選択されたlargeIdを使ってフィルタリングしたい
    setMediumSelect(data.result.medium);
  }

  return (
    <div className="App">
      <div className="largeCategorySelect">
        <div className="cp_ipselect cp_sl04">
          <select name="largeCategory" onChange={getLargeCategory}>
            {
              largeList
                ? largeList?.map((item, index) => (

                  <SelectList
                    key={(index + 1) + 1000}
                    categoryId={item.categoryId}
                    categoryName={item.categoryName}
                  />
                ))
                : null
            }
          </select>
        </div>
      </div>

      <div className="mediumCategorySelect">
        <div className="cp_ipselect cp_sl04">
          <select name="mediumCategory" onChange={getMediumCategory}>
            {
              mediumList
                ? mediumList?.map((item, index) => (
                  <SelectList
                    key={item.categoryId + (index + 1) * 200}
                    categoryId={item.categoryId}
                    categoryName={item.categoryName}
                  />
                ))
                : null
            }
          </select>
        </div>
      </div>

      <div className="recipes">
        <ul id="recipe_list">
          {recipes.map(recipe => (
            <Recipe
              recipeTitle={recipe.recipeTitle}
              publish={recipe.recipePublishday}
              recipeUrl={recipe.recipeUrl}
              foodImageUrl={recipe.mediumImageUrl}
              recipeMaterial={recipe.recipeMaterial}
            />
          ))}
        </ul>
      </div>
    </div>
  )
}

export default App;
