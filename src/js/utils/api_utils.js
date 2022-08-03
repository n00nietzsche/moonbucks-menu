let categoryNameState;
let api;

export function setApiCategoryName(categoryName) {
  categoryNameState = categoryName;

  api = axios.create({
    baseURL: `http://localhost:3000/api/category/${categoryName}/menu`,
    timeout: 1000,
  });

  api.interceptors.response.use(
    function (response) {
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data
      return response;
    },
    function (error) {
      // TODO: 공통로직 추가
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // Do something with response error
      return Promise.reject(error);
    }
  );
}

export async function loadMenuApi(categoryName) {
  setApiCategoryName(categoryName);

  const { data: menus } = await api.get();

  if (!menus || menus.length === 0) {
    return {};
  }

  const state = menus.reduce((acc, menu, index) => {
    acc[menu.id] = {
      ...menu,
      index,
    };

    return acc;
  }, {});

  return state;
}

export async function addMenuApi(name) {
  return await axios.post(getEndPoint(), {
    name,
  });
}

export async function removeMenuApi(menuId) {
  return await axios.delete(`${getEndPoint()}/${menuId}`);
}

export async function soldOutMenuApi(menuId) {
  return await axios.put(`${getEndPoint()}/${menuId}/soldout`);
}

export async function updateMenuApi(menuId, name) {
  return await axios.put(`${getEndPoint()}/${menuId}`, {
    name,
  });
}

export function handleResponse(axiosResponse, successCallback) {
  if (axiosResponse.status === 200) {
    successCallback(axiosResponse);
    return;
  }

  alert(`올바른 응답이 아닙니다. 상태 코드: ${axiosResponse.status}`);
}
