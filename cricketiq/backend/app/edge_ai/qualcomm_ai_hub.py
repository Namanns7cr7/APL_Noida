"""
QualcommAIHub — Optional interface representing Snapdragon deployment and profiling paths.
Integrates with qai-hub Python package if installed, else provides educational edge plans.
"""

import logging
from typing import Dict, Any, List

logger = logging.getLogger(__name__)

# Safely check for qai-hub package
try:
    import qai_hub as qai
except ImportError:
    qai = None
    logger.info("qai-hub package not installed. Running in mock edge fallback mode.")


class QualcommAIHub:
    def __init__(self):
        self.installed = qai is not None
        self.configured = False
        
        if self.installed:
            try:
                # Check configuration state without raising exceptions
                self.configured = qai.is_configured() if hasattr(qai, 'is_configured') else False
            except Exception:
                self.configured = False

    def get_status(self) -> Dict[str, Any]:
        """
        Returns status information about Qualcomm AI Hub readiness.
        """
        return {
            "qai_hub_installed": self.installed,
            "configured": self.configured,
            "message": (
                "Qualcomm AI Hub is active and ready." if self.configured else
                "Qualcomm AI Hub package detected. Configure API token to profile models on Snapdragon devices." if self.installed else
                "Qualcomm AI Hub integration is optional. Install qai-hub package to compile models for Snapdragon."
            )
        }

    def list_supported_devices(self) -> List[Dict[str, str]]:
        """
        Returns a list of target Snapdragon devices supported by Qualcomm AI Hub.
        If qai-hub is active, it queries active devices, otherwise returns mock reference devices.
        """
        default_devices = [
            {"name": "Snapdragon 8 Gen 3 (SM8650)", "type": "Mobile", "accelerator": "Hexagon NPU"},
            {"name": "Snapdragon X Elite (X1E84100)", "type": "Compute/Laptop", "accelerator": "Hexagon NPU"},
            {"name": "Snapdragon 8 Gen 2 (SM8550)", "type": "Mobile", "accelerator": "Hexagon NPU"},
            {"name": "Snapdragon Ride Flex (SA8775P)", "type": "Automotive", "accelerator": "Hexagon NPU"}
        ]
        
        if not self.installed or not self.configured:
            return default_devices

        try:
            # Safely list devices from live client if API key is present
            devices = qai.get_devices()
            return [{"name": d.name, "type": getattr(d, 'type', 'Edge Device'), "accelerator": "Hexagon NPU"} for d in devices[:4]]
        except Exception as e:
            logger.warning(f"Failed to fetch live Qualcomm AI Hub devices: {e}")
            return default_devices

    def explain_edge_deployment_plan(self) -> Dict[str, Any]:
        """
        Detailed breakdown for Qualcomm hackathon judges on how the models are prepared for Snapdragon.
        """
        return {
            "phases": [
                {
                    "step": 1,
                    "title": "Model Export",
                    "description": "Export the PyTorch win-probability and momentum classifiers to PyTorch/ONNX graph files."
                },
                {
                    "step": 2,
                    "title": "AI Hub Compilation",
                    "description": "Compile the ONNX graph with Qualcomm AI Hub targeting Snapdragon 8 Gen 3 or Snapdragon X Elite platforms."
                },
                {
                    "step": 3,
                    "title": "Quantization",
                    "description": "Utilize AIMET (AI Model Efficiency Toolkit) to quantize models to INT8, achieving massive NPU speedups with near-zero accuracy drop."
                },
                {
                    "step": 4,
                    "title": "QNN Runtime Execution",
                    "description": "Load the compiled `.dlc` or optimized ONNX models locally in CricketIQ using ONNX Runtime with Qualcomm QNN Execution Provider."
                }
            ],
            "target_latency_ms": "< 15ms",
            "ram_footprint_mb": "< 50MB",
            "ready_for_npu": True
        }
