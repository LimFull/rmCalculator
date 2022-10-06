import {FC} from "react";
import styled from "styled-components";
import {KIND} from "../../type/kind";
import Big from "big.js";


interface Props {
  rm5: number;
  rm10: number;
  rm15: number;
  barWeight: number;
  kind: KIND;
  bodyWeight: number;
}

const Routines: FC<Props> = ({rm5, rm10, rm15, barWeight, kind, bodyWeight}) => {
  const rage: number = rm5 * 0.05;
  
  const minus = (a: number, b: number): number => {
    return new Big(a).minus(b).toNumber();
  }

  const getTotalWeight = (weight: number, kind: KIND) => {
    if (kind === KIND.BARBELL) {
      return (weight * 2) + barWeight;
    }
    return weight
  }

  // const isCloseTo = (left: number, right: number, to: number): boolean => {
  //   const lastGap = Math.abs(getTotalWeight(left) - getTotalWeight(to));
  //   const currentGap = Math.abs(getTotalWeight(right) - getTotalWeight(to));
  //
  //   return lastGap < currentGap;
  // }

  const findCloseWeight = (disks: number[], weight: number, to: number, kind: KIND): number => {
    const filteredDisks: number[] = disks.filter(n => {
      return n > 0
    });

    const conditions: number[] = [];

    if (filteredDisks.length === 0 || filteredDisks.filter(n => n > 0).length === 0) {
      return weight;
    }

    for (let i = 0; i < filteredDisks.length; i++) {
      conditions.push(weight + filteredDisks[i])
    }

    let distance = kind === KIND.BARBELL ? Math.abs(minus(getTotalWeight(weight, kind), getTotalWeight(to, kind))) : Math.abs(minus(weight, to));

    let diskIndex = -1;
    for (let i = 0; i < conditions.length; i++) {
      if (distance > Math.abs(minus(getTotalWeight(filteredDisks[i] + weight, kind), getTotalWeight(to, kind)))) {
        diskIndex = i;
        distance = Math.abs(minus(getTotalWeight(filteredDisks[i] + weight, kind), getTotalWeight(to, kind)))
      }
    }


    if (diskIndex === -1) {
      return weight
    }

    if (filteredDisks[diskIndex] === 0) {
      return 0;
    }

    const newWeight = weight + filteredDisks[diskIndex];

    filteredDisks[diskIndex] = 0;

    if (kind === KIND.BARBELL || kind === KIND.PLATE) {
      return findCloseWeight(filteredDisks, newWeight, to, kind);
    }
    return newWeight
  }

  const getDiskWeight = (originalWeight: number, kind: KIND): number => {
    const weight = Math.max(0, kind === KIND.PLATE ? minus(originalWeight, bodyWeight) : originalWeight);
    const bar = barWeight;
    const barlessWeight = weight - bar;
    let disks: number[] = [];

    if (kind === KIND.BARBELL) {
      disks = [20, 20, 10, 10, 5, 2.5, 1.25];
    } else if (kind === KIND.PLATE) {
      disks = [20, 20, 20, 20, 10, 10, 10, 10, 5, 5, 2.5, 2.5, 1.25, 1.25, 0];
    } else if (kind === KIND.DUMBBELL) {
      disks = [2.5, 3.5, 4.5, 5.5, 6.5, 8, 9, 10, 11.5, 13.5, 16, 18, 20.5, 22.5, 24];
    }

    if (kind === KIND.BARBELL && barlessWeight <= 0) return 0;

    const half = barlessWeight / 2

    // 큰 무게부터 가능한 원판 전부 꽂기
    let goal = 0;
    let last = 0;
    let current = 0;

    if (kind === KIND.BARBELL) {
      goal = half;
    } else if (kind === KIND.PLATE) {
      goal = weight;
    } else if (kind === KIND.DUMBBELL) {
      goal = weight;
    }

    if (kind === KIND.BARBELL) {
      for (let i = 0; i < disks.length; i++) {
        current = last;
        current += disks[i];
        if (current > goal) {
          continue;
        }
        disks[i] = 0;
        last = current;
      }
    }

    // 목표 무게와 가장 가까운 무게 찾기
    return findCloseWeight(disks, last, goal, kind);
  }

  return <Container>
    <RmGroup>
      <Title>15RM</Title>
      {
        Array.from({length: 6}).map((v, i) => {
          return <Content
            key={i}>{getDiskWeight(Number((rm15 - (5 - i) * rage).toFixed(2)), kind)}</Content>
        })
      }
    </RmGroup>
    <RmGroup>
      <Title>10RM</Title>
      {
        Array.from({length: 6}).map((v, i) => {
          return <Content key={i}>{getDiskWeight(Number((rm10 - (5 - i) * rage).toFixed(2)), kind)}</Content>
        })
      }
    </RmGroup>
    <RmGroup>
      <Title>5RM</Title>
      {
        Array.from({length: 6}).map((v, i) => {
          return <Content key={i}>{getDiskWeight(Number((rm5 - (5 - i) * rage).toFixed(2)), kind)}</Content>
        })
      }
    </RmGroup>

  </Container>
}

const Title = styled.div`
  font-size: 20px;
  color: blue;
  margin-bottom: 4px;
`

const Content = styled.div`
  font-size: 18px;
  font-weight: bold;
`

const RmGroup = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid black;
  padding: 12px;
  word-break: break-word;
  margin-bottom: 10px;
  align-items: center;
  width: 80vw;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px
`

export default Routines;