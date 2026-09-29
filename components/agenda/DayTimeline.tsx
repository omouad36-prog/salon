import { useRef, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, Animated } from 'react-native';
import { TimeSlotCard } from './TimeSlotCard';
import { FreeSlotCard } from './FreeSlotCard';
import { COLORS, FONT_SIZES, SPACING } from '../../lib/constants';
import type { AppointmentWithRelations } from '../../types/agenda';

const HOUR_HEIGHT = 144; // pixels per hour
const START_HOUR = 8;   // 8:00 AM
const END_HOUR = 21;    // 9:00 PM
const TIMELINE_LEFT_MARGIN = 52;
const CARD_VERTICAL_GAP = 12;
const OVERLAP_HORIZONTAL_GAP = 8;

interface DayTimelineProps {
  appointments: AppointmentWithRelations[];
  freeSlots: { start: string; end: string; durationMinutes: number }[];
  onAppointmentPress: (appointment: AppointmentWithRelations) => void;
  onFlashOffer: (start: string, end: string) => void;
  onWaitlist: (start: string, end: string) => void;
}

export function DayTimeline({
  appointments,
  freeSlots,
  onAppointmentPress,
  onFlashOffer,
  onWaitlist,
}: DayTimelineProps) {
  const scrollRef = useRef<ScrollView>(null);

  // Scroll to current time on mount
  useEffect(() => {
    const now = new Date();
    const currentHour = now.getHours() + now.getMinutes() / 60;
    const scrollTo = (currentHour - START_HOUR - 1) * HOUR_HEIGHT;
    setTimeout(() => {
      scrollRef.current?.scrollTo({ y: Math.max(0, scrollTo), animated: false });
    }, 100);
  }, []);

  // Generate hour labels
  const hours = useMemo(
    () =>
      Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => START_HOUR + i),
    []
  );

  // Position appointment cards
  const positionedAppointments = useMemo(
    () => {
      const sortedAppointments = appointments
        .map((apt, index) => {
        const start = new Date(apt.estimated_start ?? apt.scheduled_start);
        const end = new Date(apt.scheduled_end);
        const startHours = start.getHours() + start.getMinutes() / 60;
        const endHours = end.getHours() + end.getMinutes() / 60;
        const rawTop = (startHours - START_HOUR) * HOUR_HEIGHT;
        const rawHeight = Math.max((endHours - startHours) * HOUR_HEIGHT, 72);
          return {
            appointment: apt,
            startTime: start.getTime(),
            endTime: end.getTime(),
            top: rawTop + CARD_VERTICAL_GAP / 2,
            height: Math.max(rawHeight - CARD_VERTICAL_GAP, 60),
            index,
          };
        })
        .sort((a, b) => {
          if (a.startTime !== b.startTime) return a.startTime - b.startTime;
          return a.endTime - b.endTime;
        });

      const positioned: Array<
        (typeof sortedAppointments)[number] & { columnIndex: number; columnCount: number }
      > = [];

      let cluster: typeof sortedAppointments = [];
      let clusterEnd = Number.NEGATIVE_INFINITY;

      const flushCluster = () => {
        if (cluster.length === 0) return;

        const columnsEndTimes: number[] = [];

        cluster.forEach((item) => {
          let columnIndex = columnsEndTimes.findIndex((endTime) => endTime <= item.startTime);

          if (columnIndex === -1) {
            columnIndex = columnsEndTimes.length;
            columnsEndTimes.push(item.endTime);
          } else {
            columnsEndTimes[columnIndex] = item.endTime;
          }

          positioned.push({
            ...item,
            columnIndex,
            columnCount: 0,
          });
        });

        const columnCount = columnsEndTimes.length;
        for (let i = positioned.length - cluster.length; i < positioned.length; i += 1) {
          positioned[i].columnCount = columnCount;
        }

        cluster = [];
        clusterEnd = Number.NEGATIVE_INFINITY;
      };

      sortedAppointments.forEach((item) => {
        if (cluster.length === 0) {
          cluster = [item];
          clusterEnd = item.endTime;
          return;
        }

        if (item.startTime < clusterEnd) {
          cluster.push(item);
          clusterEnd = Math.max(clusterEnd, item.endTime);
          return;
        }

        flushCluster();
        cluster = [item];
        clusterEnd = item.endTime;
      });

      flushCluster();

      return positioned.sort((a, b) => {
        if (a.top !== b.top) return a.top - b.top;
        if (a.columnIndex !== b.columnIndex) return a.columnIndex - b.columnIndex;
        return a.index - b.index;
      });
    },
    [appointments]
  );

  // Position free slot cards
  const positionedFreeSlots = useMemo(
    () =>
      freeSlots.map((slot, index) => {
        const start = new Date(slot.start);
        const startHours = start.getHours() + start.getMinutes() / 60;
        const rawTop = (startHours - START_HOUR) * HOUR_HEIGHT;
        const rawHeight = Math.max((slot.durationMinutes / 60) * HOUR_HEIGHT, 72);
        const top = rawTop + CARD_VERTICAL_GAP / 2;
        const height = Math.max(rawHeight - CARD_VERTICAL_GAP, 60);
        return { ...slot, top, height, index };
      }),
    [freeSlots]
  );

  return (
    <ScrollView
      ref={scrollRef}
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Hour lines */}
      {hours.map((hour) => (
        <View
          key={hour}
          style={[
            styles.hourRow,
            { top: (hour - START_HOUR) * HOUR_HEIGHT },
          ]}
        >
          <Text style={styles.hourLabel}>
            {hour.toString().padStart(2, '0')}:00
          </Text>
          <View style={styles.hourLine} />
        </View>
      ))}

      {/* Current time indicator */}
      <NowLine />

      <View style={styles.cardsLayer}>
        {positionedAppointments.map(
          ({ appointment, top, height, index, columnIndex, columnCount }) => (
            <View
              key={appointment.id}
              style={[
                styles.cardContainer,
                {
                  top,
                  minHeight: height,
                  left: `${(columnIndex / columnCount) * 100}%`,
                  width: `${100 / columnCount}%`,
                  paddingLeft: columnIndex === 0 ? 0 : OVERLAP_HORIZONTAL_GAP / 2,
                  paddingRight:
                    columnIndex === columnCount - 1 ? 0 : OVERLAP_HORIZONTAL_GAP / 2,
                },
              ]}
            >
              <TimeSlotCard
                appointment={appointment}
                onPress={onAppointmentPress}
                index={index}
              />
            </View>
          )
        )}

        {positionedFreeSlots.map((slot) => (
          <View
            key={`free-${slot.start}`}
            style={[styles.cardContainer, { top: slot.top, minHeight: slot.height }]}
          >
            <FreeSlotCard
              start={slot.start}
              end={slot.end}
              durationMinutes={slot.durationMinutes}
              onFlashOffer={() => onFlashOffer(slot.start, slot.end)}
              onWaitlist={() => onWaitlist(slot.start, slot.end)}
              index={slot.index}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

function NowLine() {
  const now = new Date();
  const currentHour = now.getHours() + now.getMinutes() / 60;
  const top = (currentHour - START_HOUR) * HOUR_HEIGHT;
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 0.5,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [pulse]);

  if (currentHour < START_HOUR || currentHour > END_HOUR) return null;

  return (
    <View style={[styles.nowLineContainer, { top }]} pointerEvents="none">
      <Animated.View style={[styles.nowDot, { opacity: pulse }]} />
      <View style={styles.nowLine} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    position: 'relative',
    height: (END_HOUR - START_HOUR + 1) * HOUR_HEIGHT,
    paddingRight: SPACING.base,
  },
  hourRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  hourLabel: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.caption,
    fontWeight: '400',
    color: COLORS.textTertiary,
    width: TIMELINE_LEFT_MARGIN - 8,
    textAlign: 'right',
    fontVariant: ['tabular-nums'],
  },
  hourLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.borderDefault,
    marginLeft: SPACING.sm,
  },
  cardContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  cardsLayer: {
    position: 'absolute',
    top: 0,
    left: TIMELINE_LEFT_MARGIN,
    right: 0,
    bottom: 0,
  },
  // Now line
  nowLineContainer: {
    position: 'absolute',
    left: TIMELINE_LEFT_MARGIN - 4,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 50,
  },
  nowDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.timelineNow,
  },
  nowLine: {
    flex: 1,
    height: 2,
    backgroundColor: COLORS.timelineNow,
  },
});
