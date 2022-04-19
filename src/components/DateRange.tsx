import { useRecoilState, useRecoilValue } from "recoil";
import { Button, DatePicker, message, Typography } from "antd";
import styled from "styled-components";
import dayjs from "dayjs";

import {
  endDateState,
  vipsState,
  startDateState,
  accessTokenState,
} from "@/store";
import { StudioMateService } from "@/services";

const { Title } = Typography;

const { RangePicker } = DatePicker;

export function DateRange() {
  const accessToken = useRecoilValue(accessTokenState);

  const [startDate, setStartDate] = useRecoilState(startDateState);
  const [endDate, setEndDate] = useRecoilState(endDateState);

  const [_, setVips] = useRecoilState(vipsState);

  const handleRangeChange = (([start, end]: [string, string]) => {
    setStartDate(dayjs(start).format("YYYY-MM-DD"));
    setEndDate(dayjs(end).format("YYYY-MM-DD"));
  }) as any;

  const load = async () => {
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
      <Title level={3}>탐색할 기간을 입력해주세요.</Title>
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
