export function calorieCal(gender, weight, height, age, activityLevel) {
  console.log(gender, weight, height, age, activityLevel);
  if (gender === 'female') {
    let caloriesCalculated = Math.round(66.5+(13.75*weight*0.454)+(5.003*height)-(6.775*age));
    if(activityLevel === 'Sedentary'){
        return calorie = Math.round(caloriesCalculated*1.2);
    }else if(activityLevel === 'LightlyActive'){
        return calorie = Math.round(caloriesCalculated*1.375);
    }else if(activityLevel === 'Active'){
        return calorie = Math.round(caloriesCalculated*1.55);
    }else{
        return calorie = Math.round(caloriesCalculated*1.725);
    }
  }else if (gender === 'male') {
    let caloriesCalculated = Math.round(665.1+(9.563*weight*0.454)+(1.85*height)-(4.676*age));
    if(activityLevel === 'Sedentary'){
        return calorie = Math.round(caloriesCalculated*1.2);
    }else if(activityLevel === 'LightlyActive'){
        return calorie = Math.round(caloriesCalculated*1.375);
    }else if(activityLevel === 'Active'){
        return calorie = Math.round(caloriesCalculated*1.55);
    }else{
        return calorie = Math.round(caloriesCalculated*1.725);
    }
  }else{
    console.log("issue with gender");
  }
}
