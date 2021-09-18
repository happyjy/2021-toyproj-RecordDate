import React, { useRef, useState } from 'react';
import { Button, Tooltip } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import moment from 'moment';

import styles from './DateRecord.module.css';
import { placeListType } from '../../types';

interface DateProps {
  dateCnt: number;
  dateRecord_id: number;
  title: string;
  description: string;
  dateTime: string;
  placeList: placeListType[];
  deleteRecordDate: (recordDateId: number) => void;
  goEdit: (recordDateId: number) => void;
  resetMapByDateRecord: (e: React.MouseEvent, dateRecord_id: number) => void;
  isMobile: Boolean | undefined;
  setLastRow: (row: HTMLDivElement) => void;
  removeTableRowstyle: () => void;
}

const DateRecord: React.FC<DateProps> = React.memo(
  ({
    dateCnt,
    dateRecord_id,
    title,
    description,
    placeList,
    dateTime,
    deleteRecordDate,
    goEdit,
    resetMapByDateRecord,
    isMobile,
    setLastRow,
    removeTableRowstyle,
  }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const swiperRef = useRef<HTMLDivElement>(null);
    const [firstTouchX, setFirstTouchX] = useState<number>(0);
    const [touchstartNth1TranslateX, setTouchstartNth1TranslateX] =
      useState<number>(0);

    const getTranslateX = (el) => {
      const style = getComputedStyle(el);
      const matrix = new WebKitCSSMatrix(style.transform);
      return matrix.m41;
    };
    const onTouchStart = (e) => {
      setFirstTouchX(e.touches[0].clientX);
      setTouchstartNth1TranslateX(getTranslateX(containerRef.current));
      if (containerRef && containerRef.current) {
        containerRef.current.style.transition = `0.5s`;
      }
      removeTableRowstyle();
    };
    /* 모바일용 이벤트 */
    const onTouchEnd = (e) => {
      setFirstTouchX(0);
      const touchendNth1TranslateX = getTranslateX(containerRef.current);

      if (containerRef && containerRef.current && containerRef.current.style) {
        if (touchendNth1TranslateX > -50) {
          containerRef.current.style.cssText = `transition: transform 0.5s; transform: translateX(0px)`;
        } else {
          containerRef.current.style.cssText = `transition: transform 0.5s; transform: translateX(-100px)`;
        }
        setLastRow(containerRef.current);
      }
    };
    const onTouchMove = (e) => {
      let currX = e.touches[0].clientX;

      let moveDistance = firstTouchX - currX;
      let nth1TranslateX = moveDistance - touchstartNth1TranslateX;

      if (firstTouchX > currX) {
        // left
        // containerRef TranslateX 위치에서 touchmove 이동한 길이(firstTouchX - x)만큼 뺀다.
        if (nth1TranslateX < 200) {
          if (containerRef.current) {
            containerRef.current.style.cssText = `transform: translateX(-${nth1TranslateX}px)`;
          }
        }
        if (nth1TranslateX > 50) {
          if (swiperRef.current) {
            swiperRef.current.style.cssText = `opacity: 1;`;
            swiperRef.current.style.cssText = `font-size: 0.8rem`;
          }
        }
      } else {
        //right
        if (nth1TranslateX >= 0) {
          if (containerRef.current) {
            containerRef.current.style.cssText = `transform: translateX(-${nth1TranslateX}px)`;
          }
        }
        if (nth1TranslateX < 50) {
          if (swiperRef.current) {
            swiperRef.current.style.cssText = `opacity: 0;`;
            swiperRef.current.style.cssText = `font-size: 0px`;
          }
        }
      }
    };

    /* 클릭 이벤트 */
    const clickDelete = () => {
      deleteRecordDate(dateRecord_id);
    };
    const clickEdit = () => {
      goEdit(dateRecord_id);
    };

    return (
      <>
        <div
          className={styles.tdItemContainer}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onTouchMove={onTouchMove}
          ref={containerRef}
        >
          <div className={styles.dateCntTitleContinaer}>
            <div className={styles.dateCnt}>
              <span
                className={styles.spanDateCnt}
                onClick={(e) => resetMapByDateRecord(e, dateRecord_id)}
              >
                [{dateCnt}번째]
              </span>
            </div>
            <div className={styles.title}>
              <Link
                key={dateRecord_id}
                to={`/dateRecord/${dateRecord_id}`}
                className={styles.link_detail_title}
              >
                {title}
              </Link>
            </div>
          </div>
          <div className={styles.author}>
            <Link
              to={`/dateRecord/${dateRecord_id}`}
              className={styles.link_detail_author}
            >
              {placeList?.map((v, i) => {
                if (i === 0) return <span key={v.id}>{v.placeName}</span>;
                if (i !== 0) return <span key={v.id}>, {v.placeName}</span>;
              })}
            </Link>
          </div>
          <div className={styles.lastCell}>
            {' '}
            <div className={styles.dateTime}>
              <span>{moment(dateTime).format('YYYY-MM-DD')}</span>
            </div>
            {/* mobile 사이즈시 hidden */}
            {!isMobile && (
              <div className={styles.tooltips}>
                <Tooltip title="Edit">
                  <Button
                    size="small"
                    shape="circle"
                    onClick={clickEdit}
                    icon={<EditOutlined />}
                    className={styles.button_edit}
                  />
                </Tooltip>
                <Tooltip title="Delete">
                  <Button
                    size="small"
                    type="primary"
                    shape="circle"
                    danger
                    onClick={clickDelete}
                    icon={<DeleteOutlined />}
                  />
                </Tooltip>
              </div>
            )}
          </div>
        </div>
        {/* mobile 사이즈시 show */}
        {isMobile && (
          <div ref={swiperRef} className={styles.swiperContainer}>
            <div onClick={clickEdit} className={styles.swiperEdit}>
              <label>수정</label>
            </div>
            <div onClick={clickDelete} className={styles.swiperDelete}>
              <label>삭제</label>
            </div>
          </div>
        )}
      </>
    );
  },
);

export default DateRecord;
