import { useRecoilState } from "recoil";
import { DatePicker, Typography } from "antd";
import dayjs from "dayjs";

import { endDateState, startDateState } from "@/store";

const { Title } = Typography;

const { RangePicker } = DatePicker;

export function DateRange() {
  const [_s, setStartDate] = useRecoilState(startDateState);
  const [_e, setEndDate] = useRecoilState(endDateState);

  const handleRangeChange = (([start, end]: [string, string]) => {
    setStartDate(dayjs(start).format("YYYY-MM-DD"));
    setEndDate(dayjs(end).format("YYYY-MM-DD"));
  }) as any;

  return (
    <>
      <Title level={3}>탐색할 기간을 입력해주세요.</Title>
      <RangePicker onChange={handleRangeChange} />
    </>
  );
}
