package tech.abhiram.loompay.enums;

public enum PaymentStatus {
    CREATED,
    PROCESSING,
    SUCCESS,
    FAILED,
    REFUNDED;

    public boolean canTransitionTo(PaymentStatus next) {
        return switch (this) {
            case CREATED    -> next == PROCESSING || next == FAILED;
            case PROCESSING -> next == SUCCESS || next == FAILED;
            case SUCCESS    -> next == REFUNDED;
            case FAILED, REFUNDED -> false;
        };
    }
}
