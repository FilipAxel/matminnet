import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Link,
} from "@nextui-org/react";

interface ActionCardProps {
  title?: string;
  subTitle: string;
  message: string;
  buttonText: string;
  link: string;
}

const ActionCard: React.FC<ActionCardProps> = ({
  title,
  subTitle,
  message,
  buttonText,
  link,
}) => {
  return (
    <Card className="flex w-full flex-shrink flex-grow flex-col p-6 md:w-1/3">
      {title && (
        <CardHeader>
          <p className="w-full   text-xs text-gray-600 md:text-sm">{title}</p>
        </CardHeader>
      )}
      <CardBody>
        <div className="mb-2 w-full   text-2xl font-bold text-gray-800">
          {subTitle}
        </div>
        <p className="mb-5 text-base text-gray-600">{message}</p>
      </CardBody>
      <CardFooter className="flex justify-end">
        <Button href={link} as={Link} color="primary" radius="sm">
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ActionCard;
