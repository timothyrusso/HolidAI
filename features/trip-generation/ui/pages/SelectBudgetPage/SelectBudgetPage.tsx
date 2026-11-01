import { FlatList, View } from 'react-native';
import { BasicView, CardType, CustomIconTextCard, CustomText, colors } from '@/features/core/design-system';
import { Routes } from '@/features/core/navigation';
import { useSelectBudgetPageLogic } from '@/features/trip-generation/ui/pages/SelectBudgetPage/SelectBudgetPage.logic';
import { style } from '@/features/trip-generation/ui/pages/SelectBudgetPage/SelectBudgetPage.style';

const SeparatorItem = () => <View style={style.separator} />;

export const SelectBudgetPage = () => {
  const { state, derived, effects } = useSelectBudgetPageLogic();

  const renderBudgetItem = ({ item }: { item: (typeof derived.options)[number] }) =>
    item.id !== null ? (
      <CustomIconTextCard
        cardType={CardType.Secondary}
        label={item.title}
        icon={item.icon}
        style={style.twoColumnCard}
        selected={state.selectedBudget === item.id}
        onPress={item.onPress}
        iconColor={state.selectedBudget === item.id ? colors.primaryWhite : colors.primaryBlack}
      />
    ) : null;

  return (
    <BasicView
      nameView={Routes.SelectBudget}
      statusBarStyle="dark"
      bottomButtonTitle="REVIEW_TRIP.TITLE"
      bottomButtonPress={effects.handleButtonPress}
    >
      <CustomText text="SELECT_BUDGET.DESCRIPTION" style={style.subtitle} />
      <FlatList
        data={derived.options}
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
