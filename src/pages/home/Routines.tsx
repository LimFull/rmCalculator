import {FC} from "react";
import styled from "styled-components";

interface Props {
    rm5: number;
    rm10: number;
    rm15: number;
}

const Routines: FC<Props> = ({rm5, rm10, rm15}) => {
    const rage: number = rm5 * 0.05;

    const getTotalWeight = (weight: number) => {
        return (weight * 2) + 15;
    }

    const isCloseTo = (left: number, right: number, to: number): boolean => {
        const lastGap = Math.abs(getTotalWeight(left) - getTotalWeight(to));
        const currentGap = Math.abs(getTotalWeight(right) - getTotalWeight(to));

        return lastGap < currentGap;
    }

    const findCloseWeight = (disks: number[], weight: number, to: number): number => {
        const filteredDisks: number[] = disks.filter(n => n > 0);
        const conditions: number[] = [];

        if (filteredDisks.length === 0) {
            return weight;
        }


        for (let i = 0; i < filteredDisks.length; i++) {
            conditions.push(weight + filteredDisks[i])
        }

        let distance = Math.abs(getTotalWeight(weight) - getTotalWeight(to));
        let diskIndex = -1;
        for (let i = 0; i < conditions.length; i++) {
            if (distance > Math.abs(getTotalWeight(filteredDisks[i] + weight) - getTotalWeight(to))) {
                diskIndex = i;
                distance = Math.abs(getTotalWeight(filteredDisks[i] + weight) - getTotalWeight(to))
            }
        }

        if (diskIndex === -1) {
            return weight
        }

        const newWeight = weight + filteredDisks[diskIndex];

        filteredDisks[diskIndex] = 0;
        return findCloseWeight(filteredDisks, newWeight, to);
    }

    const getDiskWeight = (weight: number): number => {
        const bar = 15;
        const total = weight - bar;
        const disks = [20, 20, 10, 10, 5, 2.5, 1.25];

        if (total <= 0) return 0;

        const half = total / 2

        // 큰 무게부터 가능한 원판 전부 꽂기
        let last = 0;
        let current = 0;
        for (let i = 0; i < disks.length; i++) {
            current = last;
            current += disks[i];
            if (current > half) {
                continue;
            }

            disks[i] = 0;
            last = current;
        }

        // 목표 무게와 가장 가까운 무게 찾기
        return findCloseWeight(disks, last, half);
    }

    return <Container>
        <RmGroup>
            <Title>15RM</Title>
            {
                Array.from({length: 6}).map((v, i) => {
                    return <Content
                        key={i}>{getDiskWeight(Number((rm15 - (5 - i) * rage).toFixed(2)))}</Content>
                })
            }
        </RmGroup>
        <RmGroup>
            <Title>10RM</Title>
            {
                Array.from({length: 6}).map((v, i) => {
                    return <Content key={i}>{getDiskWeight(Number((rm10 - (5 - i) * rage).toFixed(2)))}</Content>
                })
            }
        </RmGroup>
        <RmGroup>
            <Title>5RM</Title>
            {
                Array.from({length: 6}).map((v, i) => {
                    return <Content key={i}>{getDiskWeight(Number((rm5 - (5 - i) * rage).toFixed(2)))}</Content>
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