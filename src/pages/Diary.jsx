import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Button from "../components/Button";
import Viewer from "../components/Viewer";
import { useContext, useState } from "react";
import { DiaryStateContext } from "../App";
import { getEmotionImage } from "../util/get-emotion-image";
import useDiary from "../hooks/useDiary";
import { getStringedDate } from "../util/get-stringed-gate";
import usePageTitle from "../hooks/usePageTitle";

const Diary = () => {
  const nav = useNavigate();
  const params = useParams();
  const curDiaryItem = useDiary(params.id);
  usePageTitle(`${params.id} 번 일기`);

  if (!curDiaryItem) {
    return <div>데이터 로딩중...</div>;
  }

  const { createdDate, emotionId, content } = curDiaryItem;
  console.log(createdDate);
  const title = getStringedDate(new Date(createdDate));

  console.log(params);
  console.log(`Diary params :  + ${JSON.stringify(params)}`);

  return (
    <div>
      <Header
        title={`${params.id} 번 ${title}`}
        leftChild={
          <Button
            onClick={() => {
              nav(-1);
            }}
            text={"< 뒤로가기"}
          />
        }
        rightChild={
          <Button
            onClick={() => {
              nav(`/edit/${params.id}`);
            }}
            text={"수정하기"}
          />
        }
      />
      <Viewer emotionId={emotionId} content={content} />
    </div>
  );
};

export default Diary;
