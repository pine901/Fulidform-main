import axios from 'axios';
import { urlChallengeVideoComplete, urlFavoriteObject, urlForgotPassword, urlGetChallengeDetail, urlGetChallengeList, urlGetChallengesTaxonomies, urlGetDashboardDetail, urlGetNutritionChallengeDetail, urlGetNutritionChallengeList, urlGetNutritionChallengesTaxonomies, urlGetPlanDetail, urlGetProgramDetail, urlGetRecipeDetail, urlGetRecipeList, urlGetRecipeTaxonomies, urlGetWorkoutDetail, urlGetWorkoutList, urlGetWorkoutTaxonomies, urlLogin, urlProgramVideoComplete, urlUpdatePassword, urlWorkoutVideoComplete } from './API_URL';
import { Config } from './Constants';
import { console_log, empty, is_null } from './Misc';

export const API_PAGE_SIZE = 24;

//axios.defaults.baseURL = Config.SERVER_API_URL;

export const apiResponseIsSuccess = (response) => {
  const { success, message, data, statusCode, code } = response;
  if (is_null(success)) {
    return true
  }
  if (success === false) {
    return false
  } else {
    return true
  }
}
export const apiLoginRequired = (response) => {
  const { success, message, data, statusCode, code } = response;
  let loginRequired = false;
  if (code === "jwt_auth_no_auth_header" || code === "jwt_auth_invalid_token") {
    loginRequired = true
  }
  return loginRequired
}

export const trimSearchPayload = (payload) => {
  let newPayload = { ...payload }
  if (empty(newPayload['search'])) {
    // if(!is_null(newPayload['search'])) {
    //   delete newPayload["search"];
    // }
    delete newPayload["search"];
  }
  return newPayload
}



export const logIn = async (payload) => {
  //console_log("login payload::", payload)
  try {
    const res = await axios.post(urlLogin, payload);
    //console_log("login res:::", res)
    return res.data;
  } catch (error) {
    //console_log("login error:::", error)
    if (error.response) {
      //console_log("error.response:::", error.response);
      //console_log("error.response.data:::", error.response.data);
      //console_log("error.response.status:::", error.response.status);
      //console_log("error.message:::", error.message);
      return error.response.data
    }
    return error;
  }
}

// export const logOut = async (payload) => {
//   try {
//     const res = await axios.post('user/logout', payload);
//     return res.data;
//   } catch (error) {
//     return error;
//   }
// }

export const apiForgotPassword = async (payload) => {
  console_log("apiForgotPassword payload::", payload)
  try {
    const res = await axios.post(urlForgotPassword, payload);
    return res.data;
  } catch (error) {
    if (error.response) {
      return error.response.data
    }
    return error;
  }
}

export const apiUpdatePassword = async (payload) => {
  console_log("apiUpdatePassword payload::", payload)
  try {
    const res = await axios.post(urlUpdatePassword, payload);
    return res.data;
  } catch (error) {
    if (error.response) {
      return error.response.data
    }
    return error;
  }
}

export const apiGetWorkoutTaxonomies = async () => {
  try {
    const res = await axios.get(urlGetWorkoutTaxonomies);
    return res.data;
  } catch (error) {
    if (error.response) {
      return error.response.data
    }
    return error;
  }
}

export const apiGetWorkoutList = async (payload) => {
  // payload  ////////////////////////////////////////
  // {
  //     "search": "ball",
  //     "workout_type": int (type id, optional),
  //     "body_part": int (body id, optional),
  //     "equipment": int (equipment id, optional),
  //     "activity": int (activity id, optional),
  //     "duration": int (duration id, optional),
  //     "experience": int (experience id, optional),
  //     "limit": int (optional, defaults to 10),
  //     "page": int (optional, defaults to 1)
  // }
  try {

    const res = await axios.post(urlGetWorkoutList, trimSearchPayload(payload));
    return res.data;
  } catch (error) {
    if (error.response) {
      return error.response.data
    }
    return error;
  }
}

export const apiGetWorkoutDetail = async (itemId) => {
  try {
    const res = await axios.get(urlGetWorkoutDetail + itemId);
    return res.data;
  } catch (error) {
    if (error.response) {
      return error.response.data
    }
    return error;
  }
}

export const apiGetChallengeTaxonomies = async () => {
  try {
    const res = await axios.get(urlGetChallengesTaxonomies);
    return res.data;
  } catch (error) {
    if (error.response) {
      return error.response.data
    }
    return error;
  }
}

export const apiGetChallengeList = async (payload) => {
  try {
    const res = await axios.post(urlGetChallengeList, trimSearchPayload(payload));
    return res.data;
  } catch (error) {
    if (error.response) {
      return error.response.data
    }
    return error;
  }
}

export const apiGetChallengeDetail = async (itemId) => {
  try {
    const res = await axios.get(urlGetChallengeDetail + itemId);
    return res.data;
  } catch (error) {
    if (error.response) {
      return error.response.data
    }
    return error;
  }
}

export const apiGetRecipeTaxonomies = async () => {
  try {
    const res = await axios.get(urlGetRecipeTaxonomies);
    return res.data;
  } catch (error) {
    if (error.response) {
      return error.response.data
    }
    return error;
  }
}

export const apiGetRecipeList = async (payload) => {
  try {
    const res = await axios.post(urlGetRecipeList, trimSearchPayload(payload));
    return res.data;
  } catch (error) {
    if (error.response) {
      return error.response.data
    }
    return error;
  }
}

export const apiGetRecipeDetail = async (itemId) => {
  try {
    const res = await axios.get(urlGetRecipeDetail + itemId);
    return res.data;
  } catch (error) {
    if (error.response) {
      return error.response.data
    }
    return error;
  }
}

export const apiGetNutritionChallengeTaxonomies = async () => {
  try {
    const res = await axios.get(urlGetNutritionChallengesTaxonomies);
    return res.data;
  } catch (error) {
    if (error.response) {
      return error.response.data
    }
    return error;
  }
}

export const apiGetNutritionChallengeList = async (payload) => {
  try {
    const res = await axios.post(urlGetNutritionChallengeList, trimSearchPayload(payload));
    return res.data;
  } catch (error) {
    if (error.response) {
      return error.response.data
    }
    return error;
  }
}

export const apiGetNutritionChallengeDetail = async (itemId) => {
  try {
    const res = await axios.get(urlGetNutritionChallengeDetail + itemId);
    return res.data;
  } catch (error) {
    if (error.response) {
      return error.response.data
    }
    return error;
  }
}

export const apiGetDashboardDetail = async () => {
  try {
    const res = await axios.get(urlGetDashboardDetail);
    return res.data;
  } catch (error) {
    if (error.response) {
      return error.response.data
    }
    return error;
  }
}

export const apiFavoriteObject = async (payload) => {
  try {
    const res = await axios.post(urlFavoriteObject, payload);
    return res.data;
  } catch (error) {
    if (error.response) {
      return error.response.data
    }
    return error;
  }
}

export const apiGetPlanDetail = async (plan_id) => {
  try {
    const res = await axios.get(urlGetPlanDetail + plan_id);
    return res.data;
  } catch (error) {
    if (error.response) {
      return error.response.data
    }
    return error;
  }
}

export const apiGetProgramDetail = async (program_id) => {
  try {
    const res = await axios.get(urlGetProgramDetail + program_id);
    return res.data;
  } catch (error) {
    if (error.response) {
      return error.response.data
    }
    return error;
  }
}

export const apiWorkoutVideoComplete = async (payload) => {
  try {
    const res = await axios.post(urlWorkoutVideoComplete, payload);
    return res.data;
  } catch (error) {
    if (error.response) {
      return error.response.data
    }
    return error;
  }
}

export const apiChallengeVideoComplete = async (payload) => {
  try {
    const res = await axios.post(urlChallengeVideoComplete, payload);
    return res.data;
  } catch (error) {
    if (error.response) {
      return error.response.data
    }
    return error;
  }
}

export const apiProgramVideoComplete = async (payload) => {
  try {
    const res = await axios.post(urlProgramVideoComplete, payload);
    return res.data;
  } catch (error) {
    if (error.response) {
      return error.response.data
    }
    return error;
  }
}