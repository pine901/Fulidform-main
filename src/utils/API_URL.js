import { Config } from './Constants';

var url_sub_prefix = "/jwt-auth/v1";
export const urlLogin = Config.SERVER_API_URL + url_sub_prefix + "/token";

url_sub_prefix = "/bdpwr/v1";
export const urlForgotPassword = Config.SERVER_API_URL + url_sub_prefix + "/reset-password";
export const urlUpdatePassword = Config.SERVER_API_URL + url_sub_prefix + "/set-password";

url_sub_prefix = "/fluidform/v1";
export const urlGetWorkoutTaxonomies = Config.SERVER_API_URL + url_sub_prefix + "/workouts/taxonomies";
export const urlGetWorkoutList = Config.SERVER_API_URL + url_sub_prefix + "/workouts";
export const urlGetWorkoutDetail = Config.SERVER_API_URL + url_sub_prefix + "/workouts/";

export const urlGetChallengesTaxonomies = Config.SERVER_API_URL + url_sub_prefix + "/challenges/taxonomies";
export const urlGetChallengeList = Config.SERVER_API_URL + url_sub_prefix + "/challenges";
export const urlGetChallengeDetail = Config.SERVER_API_URL + url_sub_prefix + "/challenges/";

export const urlGetRecipeTaxonomies = Config.SERVER_API_URL + url_sub_prefix + "/recipes/taxonomies";
export const urlGetRecipeList = Config.SERVER_API_URL + url_sub_prefix + "/recipes";
export const urlGetRecipeDetail = Config.SERVER_API_URL + url_sub_prefix + "/recipes/";

export const urlGetNutritionChallengesTaxonomies = Config.SERVER_API_URL + url_sub_prefix + "/nutrition-challenges/taxonomies";
export const urlGetNutritionChallengeList = Config.SERVER_API_URL + url_sub_prefix + "/nutrition-challenges";
export const urlGetNutritionChallengeDetail = Config.SERVER_API_URL + url_sub_prefix + "/nutrition-challenges/";

export const urlGetDashboardDetail = Config.SERVER_API_URL + url_sub_prefix + "/members/me";

export const urlFavoriteObject = Config.SERVER_API_URL + url_sub_prefix + "/members/favourites";

export const urlGetPlanDetail = Config.SERVER_API_URL + url_sub_prefix + "/plans/";
export const urlGetProgramDetail = Config.SERVER_API_URL + url_sub_prefix + "/programs/";

export const urlWorkoutVideoComplete = Config.SERVER_API_URL + url_sub_prefix + "/workouts/video-complete";
export const urlChallengeVideoComplete = Config.SERVER_API_URL + url_sub_prefix + "/challenges/video-complete";
export const urlProgramVideoComplete = Config.SERVER_API_URL + url_sub_prefix + "/programs/video-complete";
