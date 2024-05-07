import { useContext, useEffect, useState } from "react";
import { DiaryStateContext } from "../App";
import { useNavigate } from "react-router-dom";

const useDiary = (id) => {
  const data = useContext(DiaryStateContext);
  const [curDiaryItem, setCurDiaryItem] = useState();
  const nav = useNavigate();

  useEffect(() => {
    // 기존값 불러오기
    const currentDiaryItem = data.find(
      (item) => String(item.id) === String(id)
    );

    // 일치하는 값이 없으면
    if (!currentDiaryItem) {
      window.alert("존재하지 않습니다");
      nav("/", { replace: true });
    }

    setCurDiaryItem(currentDiaryItem);
  }, [id, data]);

  return curDiaryItem;
};

export default useDiary;
