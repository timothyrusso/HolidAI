import type { FeatureTier } from '@/features/core/featureTier';

export const FEATURE_TIER: FeatureTier = 0;

// Style tokens
export * from '@/features/core/ui/style/animations';
export * from '@/features/core/ui/style/blur';
export * from '@/features/core/ui/style/colors';
export * from '@/features/core/ui/style/dimensions/breakpoints';
export * from '@/features/core/ui/style/dimensions/components';
export * from '@/features/core/ui/style/dimensions/fontSize';
export * from '@/features/core/ui/style/dimensions/images';
export * from '@/features/core/ui/style/dimensions/spacing';
export * from '@/features/core/ui/style/fontFamily';
export * from '@/features/core/ui/style/icons';
export * from '@/features/core/ui/style/opacity';
export * from '@/features/core/ui/style/shadows';

// Platform
export * from '@/features/core/ui/PlatformOS';

// Basic components
export * from '@/features/core/ui/components/basic/BaseSkeleton/BaseSkeleton';
export * from '@/features/core/ui/components/basic/Cheap/Cheap';
export * from '@/features/core/ui/components/basic/CustomButton/CustomButton.logic';
export * from '@/features/core/ui/components/basic/CustomButton/CustomButtonLarge';
export * from '@/features/core/ui/components/basic/CustomButton/CustomButtonMedium';
export * from '@/features/core/ui/components/basic/CustomButton/CustomButtonSmall';
export * from '@/features/core/ui/components/basic/CustomCard/CustomCard';
export * from '@/features/core/ui/components/basic/CustomCard/CustomCard.logic';
export * from '@/features/core/ui/components/basic/CustomIcon/CustomIcon';
export * from '@/features/core/ui/components/basic/CustomIconButton/CustomIconButtonLarge';
export * from '@/features/core/ui/components/basic/CustomIconButton/CustomIconButtonMedium';
export * from '@/features/core/ui/components/basic/CustomIconButton/CustomIconButtonSmall';
export * from '@/features/core/ui/components/basic/CustomImage/CustomImage';
export * from '@/features/core/ui/components/basic/CustomPressable/CustomPressable';
export * from '@/features/core/ui/components/basic/CustomText/CustomText';
export * from '@/features/core/ui/components/basic/CustomTextButton/CustomTextButton';
export * from '@/features/core/ui/components/basic/CustomTextInput/CustomTextInput';
export * from '@/features/core/ui/components/basic/LinearGradientText/LinearGradientText';
export * from '@/features/core/ui/components/basic/LottieAnimation/LottieAnimation';

// Composite components
export * from '@/features/core/ui/components/composite/AnimatedHeaderImage/AnimatedHeaderImage';
export * from '@/features/core/ui/components/composite/CardWithImage/CardWithImage';
export * from '@/features/core/ui/components/composite/CustomHeader/CustomHeader';
export * from '@/features/core/ui/components/composite/CustomIconTextCard/CustomIconTextCard';
export * from '@/features/core/ui/components/composite/CustomNumberButton/CustomNumberButton';
export * from '@/features/core/ui/components/composite/CustomScrollView/CustomScrollView';
export * from '@/features/core/ui/components/composite/CustomTabButton/CustomTabButton';
export * from '@/features/core/ui/components/composite/CustomTabButtonWithText/CustomTabButtonWithText';
export * from '@/features/core/ui/components/composite/PlacesAutocomplete/PlacesAutocomplete';

// Dialog components
export * from '@/features/core/ui/components/dialogs/ActionModal/ActionModal';
export * from '@/features/core/ui/components/dialogs/InfoModal/InfoModal';
export * from '@/features/core/ui/components/dialogs/ModalTemplate/ModalTemplate';
export * from '@/features/core/ui/components/dialogs/ModalTemplate/ModalTemplateBody';
export * from '@/features/core/ui/components/dialogs/ModalTemplate/ModalTemplateContainer/ModalTemplateContainer';
export * from '@/features/core/ui/components/dialogs/ModalTemplate/ModalTemplateContent';
export * from '@/features/core/ui/components/dialogs/ModalTemplate/ModalTemplateFixedFooter';
export * from '@/features/core/ui/components/dialogs/ModalTemplate/ModalTemplateFooter';
export * from '@/features/core/ui/components/dialogs/ModalTemplate/ModalTemplateHeader/ModalTemplateHeader';

// Providers
export * from '@/features/core/ui/components/providers/ToastProvider';

// View components
export * from '@/features/core/ui/components/view/BasicView/BasicView';
