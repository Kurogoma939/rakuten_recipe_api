import React, { useEffect, useState } from "react";
import './App.css';
import './Select.css';
import Recipe from "./Recipe";
import SelectList from "./SelectList";
import { APP_ID } from "./secret";

const App = () => {

  const [recipes, setRecipes] = useState([]); // レシピデータ
  const [largeList, setLargeSelect] = useState([]); // 大分類
  const [mediumList, setMediumSelect] = useState([]); // 小分類
  const [largeItemValue, setLargeValue] = useState(); // 大分類のvalue値

  // 初回描画：人気ランキングとセレクトボックスのセット
  useEffect(() => {
    getRecipes();
    getLargeCategory();
  }, []);

  // 人気上位のレシピ取得 
  const getRecipes = async (url = null) => {
    if (url === null) {
      url = `https://app.rakuten.co.jp/services/api/Recipe/CategoryRanking/20170426?applicationId=${APP_ID}`;
    }
    const response = await fetch(url);
    const data = await response.json();
    setRecipes(data.result);
  }
  // 大分類カテゴリ取得
  const getLargeCategory = async () => {
    const largeResponse = await fetch(`https://app.rakuten.co.jp/services/api/Recipe/CategoryList/20170426?format=json&categoryType=large&applicationId=${APP_ID}`)
    const largeData = await largeResponse.json();
    if (largeData.result !== null && largeData.result !== undefined) {

      setLargeSelect(largeData.result.large);
    }
  }
  // 小分類カテゴリ取得
  const getMediumCategory = async (largeValue = null) => {
    const url = `https://app.rakuten.co.jp/services/api/Recipe/CategoryList/20170426?format=json&categoryType=medium&applicationId=${APP_ID}`;
    const mediumResponse = await fetch(url);
    const mediumData = await mediumResponse.json();
    if (mediumData.result !== null && mediumData.result !== undefined) {
      // 大分類が選択された場合、絞り込みをする
      if (largeValue !== null) {
        const mediumItems = mediumData.result.medium.filter(data => data.parentCategoryId === largeValue);
        setMediumSelect(mediumItems);
      } else {
        setMediumSelect(mediumData.result.medium);
      }
    }
  }

  // セレクトボックスを変えたときのアクション
  const narrowDownSelectItem = async () => {
    const largeIndex = document.getElementById('largeCategory').selectedIndex;
    const largeValue = document.getElementById('largeCategory').options[largeIndex].value;
    const mediumIndex = document.getElementById('mediumCategory').selectedIndex;
    const mediumValue = document.getElementById('mediumCategory').options[mediumIndex].value;

    // ステート管理している値と取得した値が違う場合、ステートにセット＋mediumのセレクトを再取得
    if (largeItemValue !== largeValue) {
      setLargeValue(largeValue);
      await getMediumCategory(largeValue);
    } else {
      await getMediumCategory(largeValue);

      if (largeValue !== '0' && mediumValue !== '0') {
        const categoryId = largeValue + "-" + mediumValue;
        const url = `https://app.rakuten.co.jp/services/api/Recipe/CategoryRanking/20170426?applicationId=${APP_ID}&categoryId=${categoryId}`;
        getRecipes(url);
      }
    }
  }

  return (
    <div className="App">
      <form name="SelectForm">
        <div className="largeCategorySelect">
          <div className="cp_ipselect cp_sl04">
            <select id="largeCategory" onChange={narrowDownSelectItem}>
              <option value="0">選択してください</option>
              {
                largeList
                  ? largeList?.map((item, index) => (

                    <SelectList
                      key={index}
                      parentId={item.categoryId}
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
            <select id="mediumCategory" onChange={narrowDownSelectItem}>
              <option value="0">選択してください</option>
              {
                mediumList
                  ? mediumList?.map((item, index) => (
                    <SelectList
                      key={index}
                      parentId={item.parentCategoryId}
                      categoryId={item.categoryId}
                      categoryName={item.categoryName}
                    />
                  ))
                  : null
              }
            </select>
          </div>
        </div>
      </form>

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
