import { Routes } from '@/features/core/navigation';
import { BasicView, CardType, CustomIconTextCard, CustomText, colors } from '@/features/core/ui';
import {
  BudgetData,
  useSelectBudgetPageLogic,
} from '@/features/trip-generation/ui/pages/SelectBudgetPage/SelectBudgetPage.logic';
import { style } from '@/features/trip-generation/ui/pages/SelectBudgetPage/SelectBudgetPage.style';
import { FlatList, View } from 'react-native';

const SeparatorItem = () => <View style={style.separator} />;

export const SelectBudgetPage = () => {
  const { selectedBudget, handleCardPress, handleButtonPress } = useSelectBudgetPageLogic();

  const renderBudgetItem = ({ item }: { item: (typeof BudgetData)[number] }) =>
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
        ItemSeparatorComponent={SeparatorItem}
        renderItem={renderBudgetItem}
        style={style.list}
        contentContainerStyle={style.contentContainer}
        columnWrapperStyle={style.columnWrapper}
      />
    </BasicView>
  );
};
