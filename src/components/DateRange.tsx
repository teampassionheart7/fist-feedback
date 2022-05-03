import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { Button, DatePicker, Input, Tooltip, message } from "antd";
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

  const [minAttendCount, setMinAttendCount] = useState(3);

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

    message.info(
      `입력된 기간 내에 ${
        minAttendCount ?? 0
      }회 이상 출석한 회원 목록을 가져옵니다.`
    );
    const res = await StudioMateService.getVips(
      startDate!,
      endDate!,
      accessToken!,
      minAttendCount ?? 0
    );
    setVips(res);
  };

  return (
    <>
      <Row>
        <RangePicker onChange={handleRangeChange} />
        <Tooltip title="최소 출석 횟수를 입력해주세요.">
          <Input
            type="number"
            value={minAttendCount}
            min={1}
            onChange={(e) => setMinAttendCount(Number(e.target.value))}
            style={{ width: "48px" }}
          />
        </Tooltip>
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
