import { console_log } from "./Misc"

export const getRouteParams = (routeArr, params, i=1) => {
  var routeParams = {}
  if(routeArr.length <= 1) {
    return routeParams
  }
  routeParams['screen'] = routeArr[i]
  if(i >= routeArr.length-1) {
    routeParams['params'] = params
  }else{
    routeParams['params'] = getRouteParams(routeArr, params, i+1)
  }
  return routeParams
}

export const navNavigate = (routeArr, params, navigation) => {
  //navigation.navigate(ROUTE_DRAWER_STACK_NAVIGATOR, {screen: ROUTE_USER_TAB_NAVIGATOR, params: { screen: ROUTE_DASHBOARD_TAB, params: { screen: ROUTE_SUBSCRIPTIONS }}});

  var rootRoute = routeArr[0]
  var routeParams = getRouteParams(routeArr, params)
  navigation.navigate(rootRoute, routeParams)
  return true;
};
export const navPush = (routeArr, params, navigation) => {
  //navigation.push(ROUTE_DRAWER_STACK_NAVIGATOR, {screen: ROUTE_USER_TAB_NAVIGATOR, params: { screen: ROUTE_DASHBOARD_TAB, params: { screen: ROUTE_SUBSCRIPTIONS }}});

  var rootRoute = routeArr[0]
  var routeParams = getRouteParams(routeArr, params)
  navigation.push(rootRoute, routeParams)
  return true;
};
export const navReplace = (routeArr, params, navigation) => {
  //navigation.replace(ROUTE_DRAWER_STACK_NAVIGATOR, {screen: ROUTE_USER_TAB_NAVIGATOR, params: { screen: ROUTE_DASHBOARD_TAB, params: { screen: ROUTE_SUBSCRIPTIONS }}});

  var rootRoute = routeArr[0]
  var routeParams = getRouteParams(routeArr, params)
  navigation.replace(rootRoute, routeParams)
  return true;
};
export const navReset = (routeArr, params, navigation) => {
  var rootRoute = routeArr[0]
  var routeParams = getRouteParams(routeArr, params)  
  navigation.reset({ index: 0, routes: [{ name: rootRoute, params:  routeParams }] });
  return true;
};
