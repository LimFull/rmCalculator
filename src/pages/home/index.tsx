import {ChangeEvent, FC, useState} from "react";
import styled from "styled-components";
import Routines from "./Routines";
import {KIND} from "../../type/kind";

const Home: FC = () => {
  const [lbs, setLbs] = useState<string>('');
  const [reps, setReps] = useState<number>(1);
  const [kind, setKind] = useState<KIND>(KIND.BARBELL);
  const [barWeight, setBarWeight] = useState<number>(15);
  const [principleRms, setPrincipleRms] = useState<number[]>([0, 0, 0, 0])
  const ratio: number[] = [0, 1.0, 0.95, 0.93, 0.90, 0.87, 0.85, 0.83, 0.80, 0.77, 0.75, 0.73, 0.70, 0.67, 0.65, 0.63]

  const handleValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLbs(e.target.value);
  }

  const handleSelectReps = (e: ChangeEvent<HTMLSelectElement>) => {
    setReps(Number(e.target.value));
  }

  const handleSelectKinds = (e: ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value as KIND;
    setKind(selected);
  }

  const handleBarWeightChange = (e: ChangeEvent<HTMLInputElement>) => {
    setBarWeight(Number(e.target.value));
  }

  const onCalculateClick = () => {
    const maxSingle = Number(lbs) / ratio[reps]
    const rm1 = Number((maxSingle * ratio[1]).toFixed(2));
    const rm5 = Number((maxSingle * ratio[5]).toFixed(2));
    const rm10 = Number((maxSingle * ratio[10]).toFixed(2));
    const rm15 = Number((maxSingle * ratio[15]).toFixed(2));
    setPrincipleRms([rm1, rm5, rm10, rm15])

  }

  return <Container>
    <InputContainer>
      <LBSInput placeholder={'kg'} type={'number'} value={lbs} onChange={handleValueChange}/>
      <Reps onChange={handleSelectReps}>
        <option value={1}>1</option>
        <option value={2}>2</option>
        <option value={3}>3</option>
        <option value={4}>4</option>
        <option value={5}>5</option>
        <option value={6}>6</option>
        <option value={7}>7</option>
        <option value={8}>8</option>
        <option value={9}>9</option>
        <option value={10}>10</option>
        <option value={11}>11</option>
        <option value={12}>12</option>
        <option value={13}>13</option>
        <option value={14}>14</option>
        <option value={15}>15</option>
      </Reps>
      <CalculateBtn onClick={onCalculateClick}>계산</CalculateBtn>
    </InputContainer>
    <BarContainer>
      {"종류"}<Kinds onChange={handleSelectKinds}>
      <option value={KIND.BARBELL}>바벨</option>
      <option value={KIND.PLATE}>원판</option>
      <option value={KIND.DUMBBELL}>덤벨</option>
    </Kinds>
    </BarContainer>
    <BarContainer>
      {"바 무게"}<LBSInput placeholder={'15'} value={barWeight.toString()} onChange={handleBarWeightChange}/>
    </BarContainer>
    <RmText>{`1RM : ${principleRms[0]} kg`}</RmText>
    <RmText>{`5RM : ${principleRms[1]} kg`}</RmText>
    <RmText>{`10RM : ${principleRms[2]} kg`}</RmText>
    <RmText>{`15RM : ${principleRms[3]} kg`}</RmText>
    <Routines rm5={principleRms[1]} rm10={principleRms[2]} rm15={principleRms[3]} barWeight={barWeight}
              kind={kind}></Routines>
  </Container>
}

const BarContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 12px;
  width: 100%;
  padding-left: 40vw;
`

const RmText = styled.div`
`

const CalculateBtn = styled.button`
  font-size: 18px
`

const Kinds = styled.select`
  font-size: 18px;
  margin-left: 10px;

`

const Reps = styled.select`
  font-size: 18px;
  margin-right: 20px;
`

const LBSInput = styled.input`
  font-size: 18px;
  width: 100px;
  text-align: right;
  margin-right: 20px;
  margin-left: 10px;
`

const InputContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-top: 30px;
  margin-bottom: 12px;
`


const Container = styled.div`
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 255, 0.18);
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  align-items: center;
`

export default Home;