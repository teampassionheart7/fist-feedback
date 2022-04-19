import { useRecoilState, useRecoilValue } from "recoil";
import { Button, DatePicker, message } from "antd";
import styled from "styled-components";
import dayjs from "dayjs";

import {
  endDateState,
  vipsState,
  startDateState,
  accessTokenState,
  greetingsState,
  closingsState,
} from "@/store";
import { StudioMateService } from "@/services";

const { RangePicker } = DatePicker;

export function DateRange() {
  const accessToken = useRecoilValue(accessTokenState);
  const greetings = useRecoilValue(greetingsState);
  const closings = useRecoilValue(closingsState);

  const [startDate, setStartDate] = useRecoilState(startDateState);
  const [endDate, setEndDate] = useRecoilState(endDateState);

  const [_, setVips] = useRecoilState(vipsState);

  const handleRangeChange = (([start, end]: [string, string]) => {
    setStartDate(dayjs(start).format("YYYY-MM-DD"));
    setEndDate(dayjs(end).format("YYYY-MM-DD"));
  }) as any;

  const load = async () => {
    if (!greetings.length || !closings.length) {
      message.error("인사말과 맺음말을 1개 이상 추가해주세요.");
      return;
    }
    if (!startDate || !endDate) {
      message.error("시작일/종료일을 입력해주세요.");
      return;
    }

    const res = await StudioMateService.getVips(
      startDate!,
      endDate!,
      accessToken!
    );
    setVips(res);
  };

  return (
    <>
      <Row>
        <RangePicker onChange={handleRangeChange} />
        <Button type="primary" disabled={!startDate || !endDate} onClick={load}>
          불러오기
        </Button>
      </Row>
    </>
  );
}

const Row = styled.div`
  display: flex;
  flex-direction: row;

  & > * {
    margin-right: 16px;
  }
`;
