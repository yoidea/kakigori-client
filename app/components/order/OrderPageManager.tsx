import { useCallback, useEffect, useMemo, useState, type JSX } from "react";
import { useNavigate } from "react-router";
import { createOrder, fetchMenu, type MenuItem } from "../../api/client";
import { conversationFlow } from "../../constants/q-and-a";
import ChatGate from "./ChatGate";
import ConnectionNotice from "./ConnectionNotice";
import MenuSelection from "./MenuSelection";

enum OrderStep {
  Chat,
  ConnectionNotice,
  Menu,
}

const STEP_SEQUENCE: OrderStep[] = [
  OrderStep.Chat,
  OrderStep.ConnectionNotice,
  OrderStep.Menu,
];

type StepConfig = {
  id: OrderStep;
  render: () => JSX.Element;
};

type OrderPageManagerProps = {
  storeId: string;
};

export default function OrderPageManager({ storeId }: OrderPageManagerProps) {
  const navigate = useNavigate();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [menuLoading, setMenuLoading] = useState(false);
  const [menuError, setMenuError] = useState<string | null>(null);
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const currentStep = STEP_SEQUENCE[currentStepIndex];

  const goToNextStep = useCallback(() => {
    setCurrentStepIndex((prev) => Math.min(prev + 1, STEP_SEQUENCE.length - 1));
  }, []);

  const loadMenu = useCallback(async () => {
    if (!storeId) return;
    setMenuLoading(true);
    setMenuError(null);
    try {
      const items = await fetchMenu(storeId);
      setMenu(items);
    } catch (error) {
      setMenuError(error instanceof Error ? error.message : String(error));
    } finally {
      setMenuLoading(false);
    }
  }, [storeId]);

  useEffect(() => {
    if (currentStep === OrderStep.Menu) {
      if (menu.length === 0 && !menuLoading) {
        void loadMenu();
      }
      return;
    }

    if (selectedMenuId !== null) setSelectedMenuId(null);
    if (submitError) setSubmitError(null);
    if (submitting) setSubmitting(false);
  }, [
    currentStep,
    loadMenu,
    menu.length,
    menuLoading,
    selectedMenuId,
    submitError,
    submitting,
  ]);

  const handleOrderSubmit = useCallback(async () => {
    if (!storeId || !selectedMenuId) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const order = await createOrder(storeId, selectedMenuId);
      navigate(`/order/${storeId}/receipt/${order.id}`);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : String(error));
    } finally {
      setSubmitting(false);
    }
  }, [navigate, selectedMenuId, storeId]);

  const steps: StepConfig[] = useMemo(
    () => [
      {
        id: OrderStep.Chat,
        render: () => (
          <ChatGate
            flow={conversationFlow}
            onComplete={() => {
              goToNextStep();
            }}
          />
        ),
      },
      {
        id: OrderStep.ConnectionNotice,
        render: () => (
          <ConnectionNotice
            onConfirm={() => {
              goToNextStep();
            }}
          />
        ),
      },
      {
        id: OrderStep.Menu,
        render: () => (
          <MenuSelection
            menu={menu}
            loading={menuLoading}
            error={menuError}
            onRetry={loadMenu}
            selectedMenuId={selectedMenuId}
            onSelect={setSelectedMenuId}
            onSubmit={handleOrderSubmit}
            submitting={submitting}
            orderError={submitError}
          />
        ),
      },
    ],
    [
      goToNextStep,
      handleOrderSubmit,
      loadMenu,
      menu,
      menuError,
      menuLoading,
      selectedMenuId,
      submitting,
      submitError,
    ],
  );

  const activeStep = steps.find((step) => step.id === currentStep);

  return (
    <main className="mx-auto flex min-h-[100dvh] max-w-sm flex-col justify-start p-4">
      <h1 className="text-center text-2xl font-bold">かき氷注文システム</h1>
      {activeStep?.render()}
    </main>
  );
}
