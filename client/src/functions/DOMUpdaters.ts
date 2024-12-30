/**
 *
 * @param id string expecting the ID of the element that we are going to reset the value.
 * @returns void
 * @description used to reset the value to a input field
 */
export const resetInputValue = (id: string): void => {
	const targetElement: HTMLElement | null = document.getElementById(id);
	if (targetElement) {
		(targetElement as HTMLInputElement).value = "";
	}
};
