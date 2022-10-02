import {FC} from "react";
import styled from "styled-components";

interface Props {
    rm5: number;
    rm10: number;
    rm15: number;
}

const Routines: FC<Props> = ({rm5, rm10, rm15}) => {
    const rage: number = rm5 * 0.05;


    const isCloseTo = (left: number, right: number, to: number): boolean => {
        console.log("left", left, "right", right, "to", to)
        const lastGap = Math.abs((15 + (left) * 2) - (15 + (to * 2)));
        const currentGap = Math.abs((15 + (right) * 2) - (15 + (to * 2)));
        console.log("last,currentgap", lastGap, currentGap)
        return lastGap < currentGap;
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

        // 낮은 무게부터 꽂으면서 목표 무게와 가장 가까운 무게 찾기
        disks.reverse()
        let addingLast = last;
        let addingCurrent = 0;
        for (let disk of disks) {
            addingCurrent = addingLast;
            addingCurrent += disk;
            if (isCloseTo(addingLast, addingCurrent, half)) {
                return addingLast;
            }
            addingLast = addingCurrent
        }

        return addingLast;
    }
    const goal = 32;
    console.log('test', getDiskWeight(goal), getDiskWeight(goal) * 2 + 15)
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