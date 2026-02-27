import { Routes } from '@/modules/navigation/domain/entities/routes';
import type { BudgetInfo } from '@/modules/trips/domain/entities/BudgetInfo';
import { CardType } from '@/ui/components/basic/CustomCard/CustomCard.logic';
import CustomText from '@/ui/components/basic/CustomText/CustomText';
import { CustomIconTextCard } from '@/ui/components/composite/CustomIconTextCard/CustomIconTextCard';
import { BasicView } from '@/ui/components/view/BasicView/BasicView';
import { colors } from '@/ui/style/colors';
import { FlatList, View } from 'react-native';
import { BudgetData } from './SelectBudgetPage.data';
import { useSelectBudgetPageLogic } from './SelectBudgetPage.logic';
import { style } from './SelectBudgetPage.style';

const separatorItem = () => <View style={style.separator} />;

const SelectBudgetPage = () => {
  const { selectedBudget, handleCardPress, handleButtonPress } = useSelectBudgetPageLogic();

  const item = ({ item }: { item: BudgetInfo }) =>
    item.id !== null ? (
      <CustomIconTextCard
        cardType={CardType.Secondary}
        label={item.title}
        icon={item.icon}
        style={style.twoColumnCard}
        selected={selectedBudget === item.id}
        onPress={() => handleCardPress(item.id ?? 0)}
        iconColor={selectedBudget === item.id ? colors.primaryWhite : colors.primaryBlack}
      />
    ) : null;

  return (
    <BasicView
      nameView={Routes.SelectBudget}
      statusBarStyle="dark"
      bottomButtonTitle="REVIEW_TRIP.TITLE"
      bottomButtonPress={handleButtonPress}
    >
      <CustomText text="SELECT_BUDGET.DESCRIPTION" style={style.subtitle} />
      <FlatList
        data={BudgetData}
        numColumns={2}
        keyExtractor={item => item.id?.toString() ?? ''}
        ItemSeparatorComponent={separatorItem}
        renderItem={item}
        style={style.list}
        contentContainerStyle={style.contentContainer}
        columnWrapperStyle={style.columnWrapper}
      />
    </BasicView>
  );
};

export default SelectBudgetPage;
