import { Box, Modal } from "@mui/material"
import { useStoreModal } from "../../store/ModalState/modalState";

const ModalGlobal = () => {
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'fit-content',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 2,
        border: 'none',
        borderRadius: '8px',
    };
    const { isOpen, content } = useStoreModal(state => state)

    return (
        <Modal
            open={isOpen}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <div>
                {content}
                </div>
            </Box>
        </Modal>
    )
}

export default ModalGlobal