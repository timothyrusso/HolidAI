import { Cheap } from '@/ui/components/basic/Cheap/Cheap';
import { colors } from '@/ui/style/colors';
import { icons } from '@/ui/style/icons';
import { type FC, Fragment } from 'react';

type HeaderChipsProps = {
  travelers: number;
  budget: string;
  date: number;
};

export const HeaderChips: FC<HeaderChipsProps> = ({ travelers, budget, date }) => {
  return (
    <Fragment>
      <Cheap title={travelers.toString()} color={colors.primaryBlue} icon={icons.people} />
      <Cheap title={budget} color={colors.primaryBlue} icon={icons.card} />
      <Cheap title={date.toString()} color={colors.primaryGreen} icon={icons.calendar} />
    </Fragment>
  );
};
