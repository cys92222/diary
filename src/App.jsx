import "./App.css";
import {
  useReducer,
  useRef,
  useContext,
  createContext,
  useEffect,
  useState,
} from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Diary from "./pages/Diary";
import New from "./pages/New";
import Edit from "./pages/Edit";
import NotFound from "./pages/NotFound";

// state : 변화시킬 state
// action : state를 어떻게 변화 시킬지(plus, minus 등 변수로 받아서 if, switch 등으로 분기하여 처리)
//          dispatch에서 설정한 값
function reducer(state, action) {
  let nextState;

  switch (action.type) {
    case "INIT":
      return action.data;
    case "CREATE": {
      nextState = [action.data, ...state];
      break;
    }
    case "UPDATE": {
      nextState = state.map((item) =>
        String(item.id) === String(action.data.id) ? action.data : item
      );
      break;
    }
    case "DELETE": {
      nextState = state.filter(
        (item) => String(item.id) !== String(action.data.id)
      );
      break;
    }
    default:
      return state;
  }

  localStorage.setItem("diary", JSON.stringify(nextState));
  return nextState;
}

export const DiaryStateContext = createContext();
export const DiaryDispatchContext = createContext();

// 1. "/" : 모든 일기를 조회하는 Home페이지
// 2. "/new" : 새로운 일기를 작성하는 New 페이지
// 3. "/diary" : 일기를 상세 조회하는 Diary 페이지
// 4. "/edit" : 일기를 수정하는 Edit 페이지
function App() {
  // data : state명
  // dispatch : reducer 함수 발생시키는
  // reducer : state변화 시키는 함수(전역 함수로 만들어둠)
  // data(state)의 초기값
  const [data, dispatch] = useReducer(reducer, []);

  // 수정, 상세보기 페이지 등에서 data 를 사용하는데
  // 페지이제 접속한 상태에서 새로고침을하면 data 에 값을 설정하기전에
  // 해당 페이지를 먼저 랜더링해서 에러발생
  // 에러방지를 위한 로딩 기능
  const [isLoading, setIsLoading] = useState(true);

  // 일기의 순번용
  const idRef = useRef(0);

  useEffect(() => {
    const stredData = localStorage.getItem("diary");
    if (!stredData) {
      setIsLoading(false);
      return;
    }
    const parsedData = JSON.parse(stredData);
    console.log(parsedData);

    //배열인지 확인
    if (!Array.isArray(parsedData)) {
      setIsLoading(false);
      return;
    }
    let maxId = 0;
    parsedData.forEach((item) => {
      if (Number(item.id) > maxId) {
        maxId = Number(item.id);
      }
    });

    idRef.current = maxId + 1;
    dispatch({
      type: "INIT",
      data: parsedData,
    });
    setIsLoading(false);
  }, []);

  //localStorage.setItem("test", "테스트");
  //객체는 JSON.stringify 으로 문자열로 변환해야 확인할수있음
  //localStorage.setItem("person", JSON.stringify({ name: "이름", age: 1 }));

  //console.log(localStorage.getItem("test"));
  //JSON.stringify 으로 문자열로 변환해서 저장했기때문에 JSON.parse 으로 다시 객체로 변환
  //주의할점 JSON.parse 는 undefined, null 값 넣으면 에러남
  //console.log(JSON.parse(localStorage.getItem("person")));

  //로컬스토리지 삭제
  //localStorage.removeItem("test");

  // 새로운 일기 추가
  const onCreate = (createdDate, emotionId, content) => {
    // 이 값들이 reducer 함수의 매개변수 action
    dispatch({
      type: "CREATE",
      data: {
        id: idRef.current++,
        createdDate,
        emotionId,
        content,
      },
    });
  };

  // 기존 일기 수정
  const onUpdate = (id, createdDate, emotionId, content) => {
    dispatch({
      type: "UPDATE",
      data: {
        id,
        createdDate,
        emotionId,
        content,
      },
    });
  };

  // 기존일기 삭제
  const onDelete = (id) => {
    dispatch({
      type: "DELETE",
      data: {
        id,
      },
    });
  };

  if (isLoading) {
    return <div>데이터 로딩중...</div>;
  }

  return (
    <>
      <DiaryStateContext.Provider value={data}>
        <DiaryDispatchContext.Provider value={{ onCreate, onUpdate, onDelete }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/new" element={<New />} />
            <Route path="/diary/:id" element={<Diary />} />
            <Route path="/edit/:id" element={<Edit />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </DiaryDispatchContext.Provider>
      </DiaryStateContext.Provider>
    </>
  );
}

export default App;
